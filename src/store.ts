import { tracks as tracks_data } from './data/tracks'
import { trackSettings } from './data/track-settings'
import { trackWeather } from './data/track-weather'
import { formatDate, formatTime, datePacks, arrayMoveElement, objectWithoutNulls, stringDateToCZDate } from './util'
import { constants } from './data/constants'

const storeDatePack = datePacks()

export const store = {
    tournament: {
        name: '',
        description: '',
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
    },

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
        const previousTrack = this.tracks[this.tracks.length - 1]

        for ( const track_id of track_ids ) {
            const track = tracks_data.byId[track_id] as TrackData
            if ( !track ) {
                continue
            }

            await this.trackFetchInfo( track_id )

            const settings = trackSettings.byId[track_id]
            const weatherSettings = trackWeather.byId[track_id]

            store.tracks.push( {
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
                setup_change_allowed: false,
                tyre_replacement_allowed: false,
                tyre_change_allowed: previousTrack ? false : true,
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
        store.tracks.splice( track_index, 1 )
    },

    trackMove( track_index: number, offset: number ) {
        return arrayMoveElement( this.tracks, track_index, offset )
    },

    trackMoveUp( track_index: number ) {
        return this.trackMove( track_index, -1 )
    },

    trackMoveDown( track_index: number ) {
        return this.trackMove( track_index, +1 )
    },

    tournamentFromHTML( html: string ) {
        // TODO
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

            ...additionalParams
        } )
    },

    carsPhysicsFromHTML( html: string ) {
        // TODO
    },

    carsPhysicsPostOutput() {
        return objectWithoutNulls( {
            LicSel: [ '0' ], // TODO: License selection
            ModsSel: [ this.cars_physics.track_physics_id, ...this.cars_physics.selected_car_ids ]
        } )
    },

    trackFromHTML( index: number, html: string ) {
        // TODO
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

    legsFromHTML( html: string ) {
        // TODO
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
            if ( index < this.legs.length - 1 ) {
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
