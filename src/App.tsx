import Vue from 'vue'
import Tournament from './containers/Tournament'
import Cars from './containers/Cars'
import TrackList from './containers/TrackList'
import Track from './containers/Track'
import ScheduleLegs from './containers/ScheduleLegs'
import Presets from './containers/Presets'
import { store } from './store'
import tracks_data from './data/tracks.json'
import './app.scss'

enum Page {
    Tournament = 'tournament',
    Cars = 'cars',
    TrackList = 'track_list',
    Track = 'track',
    ScheduleLegs = 'schedule_legs',
    Presets = 'presets'
}

export default Vue.extend( {
    name: 'App',
    data: function() {
        return {
            current_page: Page.Tournament,
            track_index: 0,

            tracks_data,

            store
        }
    },

    computed: {
        from_date: function() {
            const { from_date, from_time } = this.store.tournament
            return (
                !from_date && !from_time ? new Date() :

                // HACK: Time is set as late as possible to please
                // the validation instead of omitting time from 'now'
                !from_time ? new Date( `${from_date}T23:59:00+0100` ) :

                new Date( `${from_date}T${from_time}+0100` )
            )
        },

        to_date: function() {
            const { to_date, to_time } = this.store.tournament
            return new Date( `${to_date}T${to_time}+0100` )
        },

        cars_errors: function() {
            const { selected_car_ids, car_physics_id, track_physics_id } = this.store.cars_physics
            return {
                selected_cars: selected_car_ids.length === 0 ? 'Must select atleast one car' : '',
                car_physics: car_physics_id.length === 0 ? 'Must select car physics' : '',
                track_physics: track_physics_id.length === 0 ? 'Must select track physics' : ''
            }
        },

        tracks_errors: function() {
            return {
                selected_tracks: this.store.tracks.length === 0 ? 'Must select atleast one track' : ''
            }
        },

        tournament_errors: function() {
            const now = new Date()
            const oneDayAfter = new Date( Number( this.from_date ) + 1000 * 60 * 60 * 24 )
            const sevenDaysAfter = new Date( Number( this.from_date ) + 1000 * 60 * 60 * 24 * 7 )

            return {
                name: this.store.tournament.name.trim().length === 0 ? 'Enter the tournament name' : '',

                from_datetime: (
                    this.from_date < now ? 'This date cannot be set earlier than now' :
                    this.from_date >= this.to_date ? `This date cannot be set later than 'Valid to' date` :
                    ''
                ),

                to_datetime: (
                    this.to_date < oneDayAfter ? `This date must be set atleast 24 hours after the tournament beginning` :
                    this.to_date > sevenDaysAfter ? 'This date cannot be set to end after more than 7 days' :
                    this.to_date <= this.from_date ? `This date cannot be set earlier than 'Valid from' date` :
                    ''
                )
            }
        },

        legs_errors: function() {
            return this.store.legs.sort( ( a, b ) => a.after_stage_divider > b.after_stage_divider ? 1 : -1 ).reduce( ( prev, leg, index, legs ) => {
                let error = ''

                const date = new Date( `${leg.date}T${leg.time}+0100` )

                if ( !leg.date ) {
                    error = 'Correct date must be set'
                }

                if ( !leg.time ) {
                    error = 'Correct time must be set'
                }

                const previous_leg = legs[index - 1]

                if ( date <= this.from_date ) {
                    error = `This date must be set after the tournament start date: ${this.from_date.toLocaleString()}`
                } else if ( date >= this.to_date ) {
                    error = `This date must be set before the tournament end date: ${this.to_date.toLocaleString()}`
                }

                if ( previous_leg ) {
                    const previous_leg_date = new Date( `${previous_leg.date}T${previous_leg.time}+0100` )
                    if ( date <= previous_leg_date ) {
                        error = 'This date must be set after the previous leg split date'
                    }
                }

                return {
                    ...prev,
                    [leg.after_stage_divider]: error
                }
            }, {} )
        }
    },

    methods: {
        hasErrors: function( errors: any ) {
            return Object.values( errors ).find( value => Boolean( value ) === true )
        }
    },

    watch: {
        'store.tracks': function( tracks: TrackData[] ) {
            if ( tracks.length < 2 ) {
                store.legs.splice( 0, store.legs.length )
                return
            }

            for ( let i = store.legs.length - 1 ; i >= 0 ; i-- ) {
                const leg = store.legs[i]
                if ( leg.after_stage_divider >= tracks.length - 1 ) {
                    store.legs.splice( i, 1 )
                }
            }
        }
    },

    render: function( h ) {
        return (
            <div id='app'>
                <table><tbody>
                    <tr>
                        <td class='nav-buttons'>
                            <button onClick={ () => { this.current_page = Page.Tournament } } class={{ active: this.current_page === Page.Tournament, error: this.hasErrors( this.tournament_errors ) }}>Tournament</button>
                            <button onClick={ () => { this.current_page = Page.Cars } } class={{ active: this.current_page === Page.Cars, error: this.hasErrors( this.cars_errors ) }}>Cars / Physics</button>
                            <button onClick={ () => { this.current_page = Page.TrackList } } class={{ active: this.current_page === Page.TrackList, error: this.hasErrors( this.tracks_errors ) }} style='margin-bottom: 8px'>Tracks</button>

                            { this.store.tracks.map( ( track, index ) => (
                                <button key={`track${index}`} onClick={ () => { this.current_page = Page.Track; this.track_index = index } }
                                    class={{ active: this.current_page === Page.Track && this.track_index === index }}
                                >
                                    SS { index + 1 } - { tracks_data[track.id].name } { track.name || '' }
                                </button>
                            ) ) }

                            <button onClick={ () => { this.current_page = Page.ScheduleLegs } } class={{ active: this.current_page === Page.ScheduleLegs, error: this.hasErrors( this.tracks_errors ) }} style='margin-top: 8px'>Schedule and legs</button>
                            <button onClick={ () => { this.current_page = Page.Presets } } class={{ active: this.current_page === Page.Presets, error: this.hasErrors( this.tracks_errors ) }}>JSON info</button>

                            <button disabled={ true } style='margin-top: 8px'>
                                { this.hasErrors( { ...this.tournament_errors, ...this.cars_errors, ...this.tracks_errors, ...this.legs_errors } ) ? ( <div>Can't send data due to errors</div> ) : ( <div>This button would send the data</div> ) }
                            </button>
                        </td>
                        <td style='vertical-align: top;'>
                        { this.current_page === Page.Tournament && <Tournament errors={ this.tournament_errors }/> }
                        { this.current_page === Page.Cars && <Cars errors={ this.cars_errors }/> }
                        { this.current_page === Page.TrackList && <TrackList errors={ this.tracks_errors }/> }
                        { this.current_page === Page.Track && <Track track={ store.tracks[this.track_index] } index={ this.track_index } /> }
                        { this.current_page === Page.ScheduleLegs && <ScheduleLegs errors={ this.legs_errors }/> }

                        { this.current_page === Page.Presets && <Presets /> }
                        </td>
                    </tr>
                </tbody></table>
            </div>
        )
    }
} )
