import * as tsx from 'vue-tsx-support'
import { store } from '../store'
import WeatherSelect from '../components/WeatherSelect'
import WeatherTwoSelect from '../components/WeatherTwoSelect'
import CloudsSelect from '../components/CloudSelect'
import SurfaceTypeSelect from '../components/SurfaceTypeSelect'
import SurfaceAgeSelect from '../components/SurfaceAgeSelect'
import ServiceSelect from '../components/ServiceSelect'
import DamageSelect from '../components/DamageSelect'
import TyreSelect from '../components/TyreSelect'
import TimeOfDaySelect from '../components/TimeOfDaySelect'
import ShortcutSelect from '../components/ShortcutSelect'
import TrackWeatherSelect from '../components/TrackWeatherSelect'
import { tracks } from '../data/tracks'
import { trackSettings } from '../data/track-settings'
import { cars } from '../data/cars'
import { arrayRandom } from '../util'
import { trackWeather } from '../data/track-weather'

export default tsx.componentFactory.create( {
    name: 'Track',
    props: {
        track: Object as () => SelectedTrack,
        index: Number
    },
    computed: {
        track_data: function() {
            return tracks.byId[this.track.id]
        },
        tracks_settings: function() {
            return trackSettings.byId[this.track.id]
        },
        tracks_weather: function() {
            return trackWeather.byId[this.track.id]
        },
        car_id_options: function() {
            return store.cars_physics.selected_car_ids.map( car_id => ( {
                id: car_id,
                value: cars.byId[car_id] as string
            } ) ).sort( ( a, b ) => a.value.toLowerCase() > b.value.toLowerCase() ? 1 : -1 )
        },
        is_last_track: function() {
            return this.index === store.tracks.length - 1
        }
    },
    methods: {
        randomSurface() {
            const { surface_type, surface_age } = this.tracks_settings

            this.track.surface_type = arrayRandom( surface_type ).id
            this.track.surface_age = arrayRandom( surface_age ).id
        },
        randomWeather() {
            const { weather2, clouds, time_of_day } = arrayRandom( this.tracks_weather )
            this.track.weather2 = weather2.id
            this.track.clouds = clouds.id
            this.track.time_of_day = time_of_day.id

            this.track.weather = arrayRandom( this.tracks_settings.weather ).id
        },
        randomService() {
            if ( this.is_last_track ) {
                return
            }

            this.track.service_time_mins = arrayRandom( [ 0, 5, 10, 15, 20, 30, 60, 90 ] )
            this.track.tyre_replacement_allowed = arrayRandom( [ true, false ] )
        },
        randomAll() {
            this.randomSurface()
            this.randomWeather()
            this.randomService()
        },
    },
    watch: {
        'track.service_time_mins': function( val ) {
            if ( val <= 0 ) {
                this.track.tyre_replacement_allowed = false
            }
        }
    },

    render: function( h ) {
        return (
            <table>
            <thead>
                <tr>
                    <td style='width: 200px;'></td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Original track name</td>
                    <td>{ this.track_data.name }</td>
                </tr>

                <tr>
                    <td>Distance</td>
                    <td>{ this.track_data.distance } km</td>
                </tr>

                <tr>
                    <td>Overriden track name</td>
                    <td><input v-model={ this.track.name } placeholder='None'/></td>
                </tr>

                <tr>
                    <td>Surface type</td>
                    <td>
                        <SurfaceTypeSelect track={ this.track }/>
                    </td>
                </tr>

                <tr>
                    <td>Surface age</td>
                    <td>
                        <SurfaceAgeSelect track={ this.track }/>
                    </td>
                </tr>

                <tr>
                    <td>Weather</td>
                    <td>
                        <WeatherSelect track={ this.track }/>
                    </td>
                </tr>

                {/* <tr>
                    <td>Time of day</td>
                    <td>
                        <TimeOfDaySelect track={ this.track }/>
                    </td>
                </tr>

                <tr>
                    <td>Weather 2</td>
                    <td>
                        <WeatherTwoSelect track={ this.track }/>
                    </td>
                </tr>

                <tr>
                    <td>Clouds</td>
                    <td>
                        <CloudsSelect track={ this.track }/>
                    </td>
                </tr> */}

                <tr>
                    <td>Weather 2</td>
                    <td>
                        <TrackWeatherSelect track={ this.track }/>
                    </td>
                </tr>

            { this.is_last_track === false && (
                <tr>
                    <td>Service area after this stage</td>
                    <td>
                        <ServiceSelect track={ this.track }/>
                    </td>
                </tr>
            ) }

            { this.is_last_track === false && this.track.service_time_mins > 0 && (
                <tr>
                    <td><label for='track.tyre_replacement_allowed'>Allow tyres replacement at service area</label></td>
                    <td><input type='checkbox' id='track.tyre_replacement_allowed' v-model={ this.track.tyre_replacement_allowed } /></td>
                </tr>
            ) }


                <tr>
                    <td><label for='track.setup_change_allowed'>Allow setup change</label></td>
                    <td><input type='checkbox' id='track.setup_change_allowed' v-model={ this.track.setup_change_allowed } /></td>
                </tr>


                <tr>
                    <td><label for='track.tyre_change_allowed'>Allow tyres type change</label></td>
                    <td><input type='checkbox' id='track.tyre_change_allowed' v-model={ this.track.tyre_change_allowed } /></td>
                </tr>

                <tr>
                    <td>Tyres</td>
                    <td>
                        <TyreSelect track={ this.track }/>
                    </td>
                </tr>

                <tr>
                    <td><label for='track.damage_change_allowed'>Allow damage change</label></td>
                    <td><input type='checkbox' id='track.damage_change_allowed' v-model={ this.track.damage_change_allowed } /></td>
                </tr>

                <tr>
                    <td>Damage</td>
                    <td>
                        <DamageSelect track={ this.track }/>
                    </td>
                </tr>

                <tr>
                    <td>Shortcuts checking</td>
                    <td>
                        <ShortcutSelect track={ this.track }/>
                    </td>
                </tr>

                <tr>
                    <td><label for='track.superally'>Allow superally in this stage</label></td>
                    <td><input type='checkbox' id='track.superally' v-model={ this.track.superally } /></td>
                </tr>

                <tr>
                    <td><label for='track.superally_hold'>Superally hold this stage</label></td>
                    <td><input type='checkbox' id='track.superally_hold' v-model={ this.track.superally_hold } /></td>
                </tr>

                <tr>
                    <td><label for='track.retry_allowed'>Allow to retry this stage</label></td>
                    <td><input type='checkbox' id='track.retry_allowed' v-model={ this.track.retry_allowed } /></td>
                </tr>

                <tr>
                    <td><label>Randomization</label></td>
                    <td>
                        <button onClick={ this.randomSurface }>Surface</button>
                        <button onClick={ this.randomWeather }>Weather</button>
                    { !this.is_last_track &&
                        <button onClick={ this.randomService }>Service</button>
                    }
                        <button onClick={ this.randomAll }>All</button>
                    </td>
                </tr>
            </tbody>
            </table>
        )
    }
} )
