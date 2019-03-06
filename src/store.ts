

const now = new Date()
const nextHalfAnHour = new Date( Number( now ) + 1000 * 60 * 30 )
const nextThreeDays = new Date( Number( now ) + 1000 * 60 * 60 * 24 * 3 )

import { tracks as tracks_data } from './data/tracks'
import { formatDate, formatTime, arrayCanMoveElement, arrayMoveElement } from './util'

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
                surface_type: 'Dry',
                surface_age: 'New',

                weather: lastTrack ? lastTrack.weather : 'Good weather',
                weather2: 'Crisp',
                weather_change_allowed: false,
                time_of_day: 'Early evening',
                clouds: 'Clear',

                service_time_mins: 0,
                setup_change_allowed: lastTrack ? lastTrack.setup_change_allowed : true,
                tyre_replacement_allowed: false,
                tyre_change_allowed: lastTrack ? lastTrack.tyre_change_allowed : true,
                tyres:
                    track.surface === 'Snow' ? 'Snow' :
                    track.surface === 'Tarmac' ? 'Dry tarmac' :
                    'Dry gravel',

                damage_change_allowed: false,
                damage: lastTrack ? lastTrack.damage : 'Realistic',

                shortcut_check: 'None',

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
}
