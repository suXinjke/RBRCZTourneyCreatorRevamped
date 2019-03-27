import Vue from 'vue'
import Tournament from './containers/Tournament'
import Cars from './containers/Cars'
import TrackList from './containers/TrackList'
import Track from './containers/Track'
import ScheduleLegs from './containers/ScheduleLegs'
import Presets from './containers/Presets'
import { store } from './store'
import { tracks } from './data/tracks'
import { constants } from './data/constants'
import { trackSettings } from './data/track-settings'
import { trackWeather } from './data/track-weather'
import { cars } from './data/cars'
import { licenses } from './data/licenses'
import { post, urlEncode, getElementByXpath, waitUntil, objectWithoutNulls } from './util'
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

            store,

            hidden: '',

            current_request_operation: '',

            serverErrors: [] as Array<{ page: string, error: string}>
        }
    },

    computed: {
        tracks_data: function() {
            return tracks.byId
        },

        tracks_settings: function() {
            return trackSettings
        },

        tracks_weather: function() {
            return trackWeather
        },

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
            const shakedown_forbidden_tracks = this.store.tracks
                .map( ( track, index ) => {
                    const { name, shakedown_allowed } = this.tracks_data[track.id]
                    return { track_name: name, shakedown_allowed, index }
                } )
                .filter( group => group.shakedown_allowed === false )
                .map( group => `SS ${group.index + 1} - ${group.track_name}` )
                .join( ', ' )

            return {
                selected_tracks: this.store.tracks.length === 0 ? 'Must select atleast one track' : '',
                offline_tracks: this.store.tournament.offline && shakedown_forbidden_tracks.length > 0 ? `${shakedown_forbidden_tracks} cannot be used in an offline tournament` : ''
            }
        },

        tournament_errors: function() {
            const now = new Date()
            const oneDayAfter = new Date( Number( this.from_date ) + 1000 * 60 * 60 * 24 )
            const sevenDaysAfter = new Date( Number( this.from_date ) + 1000 * 60 * 60 * 24 * 7 )

            const registration_deadline_in_hours = Number( this.store.tournament.registration_deadline )

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
                ),

                registration_deadline: (
                    this.store.tournament.registration_deadline.trim().length === 0 ? '' :
                    isNaN( registration_deadline_in_hours ) ? 'Must be a number' :
                    registration_deadline_in_hours < 0 ? 'Cannot be negative' :
                    Number.isInteger( registration_deadline_in_hours ) === false ? 'Must be integer' :
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
        },

        notifications: function() {
            return [
                ...Object.keys( this.tracks_settings.fetching )
                    .map( key => this.tracks_settings.fetching[key] ? `Fetching settings for ${tracks.byId[key].name}` : '' ),
                ...Object.keys( this.tracks_weather.fetching )
                    .map( key => this.tracks_settings.fetching[key] ? `Fetching weather info for ${tracks.byId[key].name}` : '' ),
            ].filter( notification => notification.length > 0 )
        }
    },

    methods: {
        hasErrors: function( errors: any ) {
            return Object.values( errors ).find( value => Boolean( value ) === true )
        },

        submit: async function() {
            const has_legs = this.store.legs.length > 0
            this.serverErrors = []

            const generalErrorXPath = '/html/body/table/tbody/tr/td/table[3]/tbody/tr[1]/td[2]/span'
            const trackErrorXPath = '/html/body/table/tbody/tr/td/table[3]/tbody/tr[1]/td[2]/center/span'

            let res: Response

            try {
                const tournament_data = this.store.tournamentPostOutput()
                this.current_request_operation = `Sending tournament info`
                res = await post( tournament_data, { flow: '0' } )
                this.checkAndAppendServerErrors( { page: 'Tournament', errorsXPath: generalErrorXPath, res } )

                const cars_physics_data = this.store.carsPhysicsPostOutput()
                this.current_request_operation = `Sending Cars / Physics info`
                res = await post( cars_physics_data, { flow: '1' } )
                this.checkAndAppendServerErrors( { page: 'Cars / Physics', errorsXPath: generalErrorXPath, res } )

                for ( let i = 0 ; i < this.store.tracks.length ; i++ ) {
                    const track_data = this.store.trackPostOutput( i )

                    this.current_request_operation = `Sending SS ${i + 1 } info`
                    res = await post( track_data, { flow: '2', curstagepos: i.toString() } )
                    this.checkAndAppendServerErrors( { page: `SS ${i + 1}`, errorsXPath: trackErrorXPath, res } )
                }

                const leg_data = this.store.legsPostOutput()
                if ( has_legs ) {
                    this.current_request_operation = `Sending legs info`
                    res = await post( leg_data, { flow: '3', page_selector: ( 2 + this.store.tracks.length ).toString() } )
                    this.checkAndAppendServerErrors( { page: 'Legs', errorsXPath: generalErrorXPath, res } )
                }

                if ( this.serverErrors.length === 0 ) {
                    this.current_request_operation = `Submitting tournament`

                    // NOTE: apparently if you have legs - you should submit the tournament from the leg page
                    // Otherwise the main tournament settings page may redirect you to leg page instead of submitting
                    res = await post( has_legs ? leg_data : tournament_data, {
                        flow: has_legs ? '3' : '0',
                        save_tournament: true,
                        save_from_leg_page: has_legs
                    } )
                    const html = await res.text()
                    const doc = ( new DOMParser() ).parseFromString( html, 'text/html' )

                    const edit_tournament_node = getElementByXpath( doc, '/html/body/table/tbody/tr/td/table[3]/tbody/tr[1]/td[2]/center[3]/a' )
                    if ( edit_tournament_node ) {
                        const href = edit_tournament_node.getAttribute( 'href' ) || ''
                        const tournament_id_match = href.match( /torid=([^&]+)/ )
                        if ( tournament_id_match ) {
                            const tournament_id = tournament_id_match[1]
                            window.location.replace( `index.php?act=tourmntsview&torid=${tournament_id}` )
                        }
                    }
                }
            } catch ( err ) {
                this.serverErrors = [ { page: 'Error', error: err.message } ]
                this.current_request_operation = ''
            }
        },

        checkAndAppendServerErrors: async function( params: { res: Response, errorsXPath: string, page: string } ) {
            const { res, errorsXPath, page } = params
            const doc = ( new DOMParser() ).parseFromString( await res.text(), 'text/html' )

            const errors = getElementByXpath( doc, errorsXPath )
            if ( errors ) {
                let error = ''
                for ( const errorNode of errors.childNodes ) {
                    if ( errorNode.nodeName === 'br' ) {
                        if ( error ) {
                            this.serverErrors.push( { page, error } )
                        }
                        error = ''
                        continue
                    }

                    error += errorNode.textContent
                }

                if ( error ) {
                    this.serverErrors.push( { page, error } )
                }
            }
        }
    },

    watch: {
        'store.tracks': function( newTracks: SelectedTrack[] ) {
            if ( newTracks.length < 2 ) {
                store.legs.splice( 0, store.legs.length )
                return
            }

            for ( let i = store.legs.length - 1 ; i >= 0 ; i-- ) {
                const leg = store.legs[i]
                if ( leg.after_stage_divider >= newTracks.length - 1 ) {
                    store.legs.splice( i, 1 )
                }
            }
        },

        'store.cars_physics.car_physics_id': function( newPhysicsId: string ) {
            cars.fetchCars( newPhysicsId )
        },

        'hidden': {
            immediate: true,
            handler: function( newValue: boolean ) {
                const tournamentForm = document.getElementById( 'tournament' )
                if ( !tournamentForm ) {
                    return
                }

                tournamentForm.style.display = newValue ? '' : 'none'
            }
        }
    },

    mounted: async function() {
        constants.fetchTournamentConstants()

        this.current_request_operation = 'Fetching track information'
        await tracks.fetchTracks()

        this.current_request_operation = 'Fetching licenses'
        await licenses.fetchLicenses( constants.carPhysics[0].id )

        const url_search_params = new URLSearchParams( window.location.search )
        const tournament_id = url_search_params.get( 'torid' )

        if ( tournament_id ) {
            try {
                const { track_ids, cars_physics: car_physics_id, has_legs } = this.store.tournamentFromHTML( document.getElementsByTagName( 'html' )[0].innerHTML )

                this.current_request_operation = 'Fetching Cars / Physics'
                await cars.fetchCars( car_physics_id )
                this.store.cars_physics.car_physics_id = car_physics_id

                this.current_request_operation = 'Fetching track information'
                for ( const track_id of track_ids ) {
                    await store.trackFetchInfo( track_id )
                }

                this.current_request_operation = 'Getting ready to fetch tournament info'
                await fetch( `/index.php?act=tourmntscre4A&new_tour=0&torid=${tournament_id}` )

                let res: Response

                const tournament_data: Partial<TournamentPOSTOutput> = objectWithoutNulls( {
                    ...this.store.tournamentPostOutput(),
                    has_legs: has_legs ? 'on' : null,
                    tourstages: track_ids.join( ';' ).concat( ';' )
                } )
                this.current_request_operation = `Fetching tournament's Cars / Physics`
                res = await post( tournament_data, { page_selector: '1' } )
                this.store.carsPhysicsLicensesFromHTML( await res.text() )

                for ( let i = 0 ; i < track_ids.length ; i++ ) {
                    const track_id = track_ids[i]

                    this.current_request_operation = `Fetching SS ${i + 1}`
                    res = await post( tournament_data, { page_selector: ( 2 + i ).toString() } )
                    const track = this.store.trackFromHTML( track_id, trackSettings.byId[track_id], await res.text() )
                    if ( track ) {
                        this.store.tracks.push( track )
                    }
                }

                if ( has_legs ) {
                    this.current_request_operation = `Fetching legs info`
                    res = await post( tournament_data, { page_selector: ( 2 + this.store.tracks.length ).toString() } )
                    this.store.legsFromHTML( await res.text() )
                }
            } catch ( err ) {
                this.serverErrors = [ { page: 'Error', error: err.message } ]
            }
        }

        this.current_request_operation = ''
    },

    render: function( h ) {
        return (
            <div id='tournament_revamped'>
                {/* <div>
                    <input id='tournament_hidden_radio_on' type='radio' name='tournament_hidden_radio' value='on' v-model={ this.hidden }/> <label for='tournament_hidden_radio_on'>Original</label>
                    <input id='tournament_hidden_radio_off' type='radio' name='tournament_hidden_radio' value='' v-model={ this.hidden }/> <label for='tournament_hidden_radio_off'>Revamped</label>
                </div> */}
                <table style={ this.hidden ? 'display: none;' : ''}><tbody>
                    <tr>
                        <td class='nav-buttons' style='width: 25%;'>
                            <button onClick={ () => { this.current_page = Page.Tournament } } class={{ active: this.current_page === Page.Tournament, error: this.hasErrors( this.tournament_errors ) }}>Tournament</button>
                            <button onClick={ () => { this.current_page = Page.Cars } } disabled={ !constants.fetched } class={{ active: this.current_page === Page.Cars, error: this.hasErrors( this.cars_errors ) }}>Cars / Physics</button>
                            <button onClick={ () => { this.current_page = Page.TrackList } } disabled={ tracks.fetching } class={{ active: this.current_page === Page.TrackList, error: this.hasErrors( this.tracks_errors ) }} style='margin-bottom: 8px'>Tracks</button>

                            { this.store.tracks.map( ( track, index ) => (
                                <button key={`track${index}`} disabled={ !this.tracks_settings.byId[track.id] || !this.tracks_weather.byId[track.id] } onClick={ () => { this.current_page = Page.Track; this.track_index = index } }
                                    class={{ active: this.current_page === Page.Track && this.track_index === index }}
                                >
                                    SS { index + 1 } - { this.tracks_data[track.id].name } { track.name ? `(${track.name})` : '' }
                                </button>
                            ) ) }

                            <button onClick={ () => { this.current_page = Page.ScheduleLegs } } class={{ active: this.current_page === Page.ScheduleLegs, error: this.hasErrors( this.legs_errors ) }} style='margin-top: 8px'>Schedule and legs</button>
                            <button onClick={ () => { this.current_page = Page.Presets } } class={{ active: this.current_page === Page.Presets }}>Presets / Misc.</button>

                        { this.hasErrors( { ...this.tournament_errors, ...this.cars_errors, ...this.tracks_errors, ...this.legs_errors } ) ?
                            <button disabled={ true } style='margin-top: 8px'>Can't send data due to errors</button>
                            :
                            <button disabled={ Boolean( this.current_request_operation ) } style='margin-top: 8px' onClick={ () => this.submit() }>Save tournament</button>
                        }
                        { this.serverErrors.length > 0 &&
                            <div style='margin-top: 8px'>
                                Failed to create tournament
                            { this.serverErrors.map( ( error, index ) =>
                                <div key={`serverError${index}`} class='error'>{ error.page }: { error.error }</div>
                            ) }
                            </div>
                        }
                        <div style='margin-top: 8px'>
                        { this.notifications.map( ( notification, index ) =>
                            <div key={`notification${index}`}>{ notification }</div>
                        ) }
                        </div>
                        <div style='margin-top: 8px'>
                            <div>ver 2</div>
                            <div>
                                <a href='https://github.com/suXinjke/RBRCZTourneyCreatorRevamped'>GitHub </a> |
                                <a href='https://twitter.com/suxinjke'> Twitter </a> |
                                <a href='http://rbr.onlineracing.cz/index.php?act=ustats&u=66612'> RBR CZ</a>
                            </div>
                        </div>
                        </td>
                        <td style='vertical-align: top;'>
                        { this.current_request_operation ? <div>{ this.current_request_operation }</div> :
                          this.current_page === Page.Tournament ? <Tournament errors={ this.tournament_errors }/> :
                          this.current_page === Page.Cars ? <Cars errors={ this.cars_errors }/> :
                          this.current_page === Page.TrackList ? <TrackList errors={ this.tracks_errors }/> :
                          this.current_page === Page.Track ? <Track track={ this.store.tracks[this.track_index] } index={ this.track_index } /> :
                          this.current_page === Page.ScheduleLegs ? <ScheduleLegs errors={ this.legs_errors }/> :
                          this.current_page === Page.Presets ? <Presets /> :
                          null
                        }
                        </td>
                    </tr>
                </tbody></table>
            </div>
        )
    }
} )
