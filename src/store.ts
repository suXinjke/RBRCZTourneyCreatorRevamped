

const now = new Date()
const nextHalfAnHour = new Date( Number( now ) + 1000 * 60 * 30 )
const nextThreeDays = new Date( Number( now ) + 1000 * 60 * 60 * 24 * 3 )

import { tracks as tracks_data } from './data/tracks'
import { formatDate, formatTime, arrayMoveElement, objectWithoutNulls } from './util'

export const store = {
    tournament: {
        name: '',
        description: '',
        online: true,
        offline: false,

        from_date: formatDate( nextHalfAnHour ),
        from_time: formatTime( nextHalfAnHour ),

        to_date: formatDate( nextThreeDays ),
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


    trackAdd( track_ids: string[] ) {
        const lastTrack = this.tracks[this.tracks.length - 1]

        track_ids.forEach( track_id => {
            const track = tracks_data.byId[track_id] as TrackData
            if ( !track ) {
                return
            }

            store.tracks.push( {
                id: track_id,
                name: '',
                surface_type: '0',
                surface_age: '0',

                weather: '0',
                weather2: '0',
                weather_change_allowed: false,
                time_of_day: '0',
                clouds: '0',

                service_time_mins: 0,
                setup_change_allowed: lastTrack ? lastTrack.setup_change_allowed : true,
                tyre_replacement_allowed: false,
                tyre_change_allowed: lastTrack ? lastTrack.tyre_change_allowed : true,
                tyres: '0',

                damage_change_allowed: false,
                damage: '0',

                shortcut_check: '0',

                superally: lastTrack ? lastTrack.superally : false,
                superally_hold: false,

                retry_allowed: lastTrack ? lastTrack.retry_allowed : false
            } )
        } )
    },

    trackRemove( track_index: number ) {
        store.tracks.splice( track_index, 1 )

        if ( store.tracks.length === 0 ) {
            return
        }

        store.tracks[store.tracks.length - 1].service_time_mins = 0
        store.tracks[store.tracks.length - 1].tyre_replacement_allowed = false
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

    tournamentPostOutput() {
        return objectWithoutNulls( {
            flow: '0',
            curstagepos: '0',
            page_selector: '1',
            submit_page_go: 'Go',
            tour_name: this.tournament.name,
            tour_descr: this.tournament.description,
            online: this.tournament.online ? 'on' : null,
            offlinet: this.tournament.offline ? 'on' : null,
            PhysicsModId: this.cars_physics.car_physics_id,
            tour_from_date: this.tournament.from_date.split( '-' ).reverse().map( number_string => Number( number_string ).toString() ).join( '.' ),
            tour_from_time: this.tournament.from_time,
            tour_to_date: this.tournament.to_date.split( '-' ).reverse().map( number_string => Number( number_string ).toString() ).join( '.' ),
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

    carsPhysicsFromHTML( html: string ) {
        // TODO
    },

    carsPhysicsPostOutput() {
        return objectWithoutNulls( {
            flow: '1',
            curstagepos: '0',
            page_selector: '2',
            submit_page_go: 'Go',
            LicSel: [ '0' ], // TODO: License selection
            ModsSel: [ this.cars_physics.track_physics_id, ...this.cars_physics.selected_car_ids ]
        } )
    },

    trackFromHTML( index: number, html: string ) {
        // TODO
    },

    trackPostOutput( index: number ) {
        const track = this.tracks[index]
        return objectWithoutNulls( {
            flow: '2',
            curstagepos: ( index + 1 ).toString(),
            page_selector: '2',
            submit_page_go: 'Go',
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
            ServiceSel: track.service_time_mins.toString(),
            canrenewtyres: track.tyre_replacement_allowed ? 'on' : null,
            canchangetyres: track.tyre_change_allowed ? 'on' : null,
            TyresSel: track.tyres,
            canchangedamage: track.damage_change_allowed ? 'on' : null,
            DamageSel: track.damage,
            CutcheckerSel: track.shortcut_check,
            leg_pos: 'TODO', // TODO: calculate the leg position
            allowsuperally: track.superally ? 'on' : null,
            superallychpoint: track.superally_hold ? 'on' : null,
            canrepeatstage: track.retry_allowed ? 'on' : null,
            canchangesetup: track.setup_change_allowed ? 'on' : null
        } )
    },

    legsFromHTML( html: string ) {
        // TODO
    },

    legsPostOutput() {
        // TODO
        return {
        }
    }
}
