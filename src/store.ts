import { tracks as tracks_data } from './data/tracks'
import { trackSettings } from './data/track-settings'
import { trackWeather } from './data/track-weather'
import { formatDate, formatTime, datePacks, arrayMoveElement, objectWithoutNulls, stringDateToCZDate, getElementByXpath, czDateToStringDate, arrayShuffle } from './util'
import { constants } from './data/constants'
import { cars } from './data/cars'

const storeDatePack = datePacks()

const defaultTournament: Tournament = {
    name: '',
    description: '',

    license_id: '0',

    online: true,
    offline: false,

    from_date: formatDate( storeDatePack.nextHalfAnHour ),
    from_time: formatTime( storeDatePack.nextHalfAnHour ),

    to_date: formatDate( storeDatePack.nextThreeDays ),
    to_time: '23:59',

    cant_resume: false,
    only_one_car: true,
    dont_show_splits: false,
    dont_show_temporary_results_in_rbr: false,
    dont_show_temporary_results_in_web: false,
    save_replays: true,
    require_stage_comments: true,
    test_tournament: false,

    password: '',
    registration_deadline: '',

    superally_penalty: 300
}

export const store = {
    tournament: defaultTournament,

    cars_physics: {
        car_physics_id: '',
        track_physics_id: '',
        selected_car_ids: [] as string[]
    },

    tracks: [] as SelectedTrack[],

    legs: [] as Leg[],

    trackFetchInfo( track_id: string ) {
        return Promise.all( [
            trackSettings.fetchTrackSettings( track_id ),
            trackWeather.fetchTrackWeather( track_id )
        ] )
    },

    async trackAdd( track_ids: string[] ) {

        for ( const track_id of track_ids ) {
            const track = tracks_data.byId[track_id] as TrackData
            if ( !track ) {
                continue
            }

            await this.trackFetchInfo( track_id )

            const previousTrack = this.tracks[this.tracks.length - 1]
            const settings = trackSettings.byId[track_id]
            const weatherSettings = trackWeather.byId[track_id]

            this.tracks.push( {
                id: track_id,
                name: '',
                surface_type: previousTrack && settings.surface_type.find( surface => surface.id === previousTrack.surface_type ) ?
                    previousTrack.surface_type :
                    settings.surface_type[0].id,

                surface_age: previousTrack && settings.surface_age.find( surface => surface.id === previousTrack.surface_age ) ?
                    previousTrack.surface_age :
                    settings.surface_age[0].id,

                weather: previousTrack ? previousTrack.weather : settings.weather[0].id,
                weather_change_allowed: previousTrack ? previousTrack.weather_change_allowed : false,

                weather2: weatherSettings[0].weather2.id,
                time_of_day: weatherSettings[0].time_of_day.id,
                clouds: weatherSettings[0].clouds.id,

                service_time_mins: 0,
                setup_change_allowed: previousTrack ? previousTrack.setup_change_allowed : true,
                tyre_replacement_allowed: false,
                tyre_change_allowed: previousTrack ? previousTrack.tyre_change_allowed : true,
                tyres: settings.tyres_recommended,

                damage_change_allowed: previousTrack ? previousTrack.damage_change_allowed : false,
                damage: previousTrack && settings.damage.find( damage => damage.id === previousTrack.damage ) ?
                    previousTrack.damage :
                    settings.damage[settings.damage.length - 1].id,

                shortcut_check: previousTrack && settings.shortcut_check.find( shortcut_check => shortcut_check.id === previousTrack.shortcut_check ) ?
                    previousTrack.shortcut_check :
                    settings.shortcut_check[0].id,

                superally: previousTrack ? previousTrack.superally : false,
                superally_hold: previousTrack ? previousTrack.superally_hold : false,

                retry_allowed: previousTrack ? previousTrack.retry_allowed : false
            } )
        }
    },

    trackRemove( track_index: number ) {
        this.tracks.splice( track_index, 1 )
        this.trackFixIncorrectService()
    },

    trackMove( track_index: number, offset: number ) {
        const moved_successfully = arrayMoveElement( this.tracks, track_index, offset )
        this.trackFixIncorrectService()
        return moved_successfully
    },

    trackMoveUp( track_index: number ) {
        return this.trackMove( track_index, -1 )
    },

    trackMoveDown( track_index: number ) {
        return this.trackMove( track_index, +1 )
    },

    tracksShuffle() {
        this.tracks = arrayShuffle( this.tracks )
    },

    tournamentFromHTML( html: string ): { track_ids: string[], cars_physics: string, has_legs: boolean } {
        const doc = ( new DOMParser() ).parseFromString( html, 'text/html' )
        const tournament_form = doc.getElementById( 'tournament' ) as HTMLFormElement | null
        if ( tournament_form ) {
            const form_data = new FormData( tournament_form )

            const tour_to_date = form_data.get( 'tour_to_date' ) as string
            const tour_from_date = form_data.get( 'tour_from_date' ) as string

            const tournament: Tournament = {
                name: ( form_data.get( 'tour_name' ) as string ) || this.tournament.name,
                description: ( form_data.get( 'tour_descr' ) as string ) || this.tournament.description,

                // NOTE: this must be got from car selection page
                license_id: '0',

                online: ( form_data.get( 'online' ) as string ) !== null,
                offline: ( form_data.get( 'offlinet' ) as string ) !== null,

                from_date: tour_from_date ? czDateToStringDate( tour_from_date ) : this.tournament.from_date,
                from_time: ( form_data.get( 'tour_from_time' ) as string ) || this.tournament.from_time,
                to_date: tour_to_date ? czDateToStringDate( tour_to_date ) : this.tournament.to_date,
                to_time: ( form_data.get( 'tour_to_time' ) as string ) || this.tournament.to_time,

                cant_resume: ( form_data.get( 'cantresrace' ) as string ) !== null,
                only_one_car: ( form_data.get( 'onecaronly' ) as string ) !== null,
                dont_show_splits: ( form_data.get( 'nosplits' ) as string ) !== null,
                dont_show_temporary_results_in_rbr: ( form_data.get( 'notempres' ) as string ) !== null,
                dont_show_temporary_results_in_web: ( form_data.get( 'notempresweb' ) as string ) !== null,
                save_replays: ( form_data.get( 'savereplays' ) as string ) !== null,
                require_stage_comments: ( form_data.get( 'getcomments' ) as string ) !== null,
                test_tournament: ( form_data.get( 'testrun' ) as string ) !== null,

                password: '',
                registration_deadline: ( form_data.get( 'enroll_close' ) as string ) || this.tournament.registration_deadline,
                superally_penalty: Number( ( form_data.get( 'SRallyPenaltySel' ) as string ) ) || this.tournament.superally_penalty,
            }

            this.tournament = tournament

            return {
                track_ids: ( form_data.get( 'tourstages' ) as string || '' ).split( ';' ).filter( id => id.length > 0 ),
                cars_physics: ( form_data.get( 'PhysicsModId' ) as string ) || this.cars_physics.car_physics_id,
                has_legs: ( form_data.get( 'has_legs' ) as string ) !== null
            }
        }

        return { track_ids: [], cars_physics: '0', has_legs: false }
    },

    tournamentPostOutput(): Partial<TournamentPOSTOutput> {
        return objectWithoutNulls( {
            tour_name: this.tournament.name.trim(),
            tour_descr: this.tournament.description,
            online: this.tournament.online ? 'on' : null,
            offlinet: this.tournament.offline ? 'on' : null,
            PhysicsModId: this.cars_physics.car_physics_id,
            tour_from_date: stringDateToCZDate( this.tournament.from_date ),
            tour_from_time: this.tournament.from_time,
            tour_to_date: stringDateToCZDate( this.tournament.to_date ),
            tour_to_time: this.tournament.to_time,
            cantresrace: this.tournament.cant_resume ? 'on' : null,
            onecaronly: this.tournament.only_one_car ? 'on' : null,
            nosplits: this.tournament.dont_show_splits ? 'on' : null,
            notempres: this.tournament.dont_show_temporary_results_in_rbr ? 'on' : null,
            notempresweb: this.tournament.dont_show_temporary_results_in_web ? 'on' : null,
            savereplays: this.tournament.save_replays ? 'on' : null,
            getcomments: this.tournament.require_stage_comments ? 'on' : null,
            testrun: this.tournament.test_tournament ? 'on' : null,
            ispassword: this.tournament.password ? 'on' : null,
            tour_password: this.tournament.password || null,
            has_legs: this.legs.length > 0 ? 'on' : null,
            need_enroll: this.tournament.registration_deadline ? 'on' : null,
            enroll_close: this.tournament.registration_deadline || null,
            SRallyPenaltySel: this.tournament.superally_penalty.toString(),
            tourstages: this.tracks.map( track => track.id ).join( ';' ) + ';'
        } )
    },

    tournamentDummyPostOutput( additionalParams: Partial<TournamentPOSTOutput> = {} ): Partial<TournamentPOSTOutput> {
        const { nextDay, nextThreeDays } = datePacks()

        return objectWithoutNulls( {
            ...this.tournamentPostOutput(),
            tour_name: 'dummy',
            tour_from_date: stringDateToCZDate( formatDate( nextDay ) ),
            tour_from_time: '00:00',

            tour_to_date: stringDateToCZDate( formatDate( nextThreeDays ) ),
            tour_to_time: '23:59',
            PhysicsModId: constants.carPhysics[0].id,

            has_legs: null,
            online: 'on',
            offlinet: null,

            ...additionalParams
        } )
    },

    carsPhysicsLicensesFromHTML( html: string ) {
        const doc = ( new DOMParser() ).parseFromString( html, 'text/html' )
        const tournament_form = doc.getElementById( 'tournament' ) as HTMLFormElement | null
        if ( tournament_form ) {
            const form_data = new FormData( tournament_form )
            const { car_physics_id } = this.cars_physics

            const mods = form_data.getAll( 'ModsSel[]' )
            for ( let mod_id of mods ) {
                mod_id = mod_id.toString()
                if ( cars.byId[mod_id] ) {
                    this.cars_physics.selected_car_ids.push( mod_id )
                } else if ( cars.trackPhysics[car_physics_id].find( option => mod_id === option.id ) ) {
                    this.cars_physics.track_physics_id = mod_id
                }
            }

            const licenses = form_data.getAll( 'LicSel[]' )
            for ( const license_id of licenses ) {
                this.tournament.license_id = license_id.toString()
                break
            }
        }
    },

    carsPhysicsPostOutput() {
        return objectWithoutNulls( {
            LicSel: [ this.tournament.license_id ],
            ModsSel: [ this.cars_physics.track_physics_id, ...this.cars_physics.selected_car_ids ]
        } )
    },

    trackFromHTML( track_id: string, settings: TrackSettings, html: string ): SelectedTrack | null {
        const doc = ( new DOMParser() ).parseFromString( html, 'text/html' )
        const tournament_form = doc.getElementById( 'tournament' ) as HTMLFormElement | null
        if ( tournament_form ) {
            const form_data = new FormData( tournament_form )

            return {
                id: track_id,
                name: ( form_data.get( 'stage_rename' ) as string ) || '',
                surface_type: ( form_data.get( 'SurfSel' ) as string ) || settings.surface_type[0].id,
                surface_age: ( form_data.get( 'SurfAgeSel' ) as string ) || settings.surface_age[0].id,

                weather: ( form_data.get( 'WeatherSel' ) as string ) || settings.weather[0].id,
                weather2: ( form_data.get( 'Weather2Sel' ) as string ) || settings.weather2[0].id,
                weather_change_allowed: ( form_data.get( 'canchangeweather' ) as string ) !== null,
                time_of_day: ( form_data.get( 'TimeOfDaySel' ) as string ) || settings.time_of_day[0].id,
                clouds: ( form_data.get( 'CloudsSel' ) as string ) || settings.clouds[0].id,

                service_time_mins: Number( ( form_data.get( 'ServiceSel' ) as string ) ) || 0,
                setup_change_allowed: ( form_data.get( 'canchangesetup' ) as string ) !== null,
                tyre_replacement_allowed: ( form_data.get( 'canrenewtyres' ) as string ) !== null,
                tyre_change_allowed: ( form_data.get( 'canchangetyres' ) as string ) !== null,
                tyres: ( form_data.get( 'TyresSel' ) as string ) || settings.tyres_recommended,

                damage_change_allowed: ( form_data.get( 'canchangedamage' ) as string ) !== null,
                damage: ( form_data.get( 'DamageSel' ) as string ) || settings.damage[settings.damage.length - 1].id,

                shortcut_check: ( form_data.get( 'CutcheckerSel' ) as string ) || settings.shortcut_check[0].id,

                superally: ( form_data.get( 'allowsuperally' ) as string ) !== null,
                superally_hold: ( form_data.get( 'superallychpoint' ) as string ) !== null,

                retry_allowed: ( form_data.get( 'canrepeatstage' ) as string ) !== null
            }
        }

        return null
    },

    trackPostOutput( track_index: number ) {
        const track = this.tracks[track_index]
        const isLast = track_index === this.tracks.length - 1
        return objectWithoutNulls( {
            renamestage: track.name ? 'on' : null,
            stage_rename: track.name,
            CarSel: this.cars_physics.selected_car_ids[0],
            SurfSel: track.surface_type,
            SurfAgeSel: track.surface_age,
            TexturesPackSel: '-1',
            WeatherPackSel: '-1',
            canchangeweather: track.weather_change_allowed ? 'on' : null,
            WeatherSel: track.weather,
            TimeOfDaySel: track.time_of_day,
            Weather2Sel: track.weather2,
            CloudsSel: track.clouds,
            ServiceSel: isLast ? null : track.service_time_mins.toString(),
            canrenewtyres: track.tyre_replacement_allowed ? 'on' : null,
            canchangetyres: track.tyre_change_allowed ? 'on' : null,
            TyresSel: track.tyres,
            canchangedamage: track.damage_change_allowed ? 'on' : null,
            DamageSel: track.damage,
            CutcheckerSel: track.shortcut_check,
            leg_pos: this.legs.length === 0 ? null : this.legs.reduce( ( prev, leg, leg_index ) => {
                return track_index > leg.after_stage_divider ? leg_index + 1 : prev
            }, 0 ),
            allowsuperally: track.superally ? 'on' : null,
            superallychpoint: track.superally_hold ? 'on' : null,
            canrepeatstage: track.retry_allowed ? 'on' : null,
            canchangesetup: track.setup_change_allowed ? 'on' : null
        } )
    },

    trackFixIncorrectService() {
        if ( this.tracks.length > 0 ) {
            const lastTrack = this.tracks[this.tracks.length - 1]
            lastTrack.service_time_mins = 0
            lastTrack.tyre_replacement_allowed = false
        }
    },

    legsFromHTML( html: string ) {
        const doc = ( new DOMParser() ).parseFromString( html, 'text/html' )

        const table = getElementByXpath( doc, '/html/body/table/tbody/tr/td/table[3]/tbody/tr[1]/td[2]/form/table/tbody' )
        const original_legs: Array<{
            stages_to: number,
            date_to: string,
            time_to: string
        }> = []
        if ( table ) {
            for ( const row of table.children ) {
                const is_leg_row = !isNaN( Number( row.children[0].textContent || '' ) )
                if ( !is_leg_row ) {
                    continue
                }

                if ( row.children.length < 7 ) {
                    continue
                }

                const stages_string = row.children[1].textContent || ''
                const stages_matches = stages_string.match( /(\d+) - (\d+)/ )
                if ( !stages_matches ) {
                    continue
                }

                const stages_to = Number( stages_matches[2] )

                const date_to = czDateToStringDate( row.children[5].children[0].getAttribute( 'value' ) || '' )
                const time_to = row.children[6].children[0].getAttribute( 'value' ) || ''

                original_legs.push( { stages_to, date_to, time_to } )
            }
        }

        for ( let i = 0 ; i < original_legs.length ; i++ ) {
            const is_last = i === original_legs.length - 1
            if ( is_last ) {
                continue
            }

            const leg = original_legs[i]
            this.legs.push( {
                after_stage_divider: leg.stages_to - 1,
                date: leg.date_to,
                time: leg.time_to
            } )
        }
    },

    legsPostOutput(): any {
        if ( this.legs.length === 0 ) {
            return {}
        }

        return this.legs.map( ( leg, leg_index ) => {
            return {
                index: leg_index,

                date_from: stringDateToCZDate( leg_index === 0 ? this.tournament.from_date : this.legs[leg_index - 1].date ),
                time_from: leg_index === 0 ? this.tournament.from_time : this.legs[leg_index - 1].time,

                date_to: stringDateToCZDate( leg.date ),
                time_to: leg.time
            }
        } ).concat( {
            index: this.legs.length,
            date_from: stringDateToCZDate( this.legs[this.legs.length - 1].date ),
            time_from: this.legs[this.legs.length - 1].time,

            date_to: stringDateToCZDate( this.tournament.to_date ),
            time_to: this.tournament.to_time
        } ).reduce( ( prev, leg, index ) => {
            const fields: any = {
            }
            if ( index > 0 ) {
                fields[`leg${index}_date_from`] = leg.date_from
                fields[`leg${index}_time_from`] = leg.time_from
            }
            if ( index <= this.legs.length - 1 ) {
                fields[`leg${index}_date_to`] = leg.date_to
                fields[`leg${index}_time_to`] = leg.time_to
            }
            return {
                ...prev,
                ...fields
            }
        }, {} )
    }
}
