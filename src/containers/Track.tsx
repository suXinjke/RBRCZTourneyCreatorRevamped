import * as tsx from 'vue-tsx-support'
import { store } from '../store'
import WeatherSelect from '../components/WeatherSelect'
import SurfaceTypeSelect from '../components/SurfaceTypeSelect'
import SurfaceAgeSelect from '../components/SurfaceAgeSelect'
import ServiceSelect from '../components/ServiceSelect'
import DamageSelect from '../components/DamageSelect'
import TyreSelect from '../components/TyreSelect'
import tracks_data from '../data/tracks.json'
import cars_data from '../data/cars.json'

export default tsx.componentFactory.create( {
    name: 'TrackList',
    props: {
        track: Object as () => SelectedTrack,
        index: Number
    },
    data: function() {
        return {
            cars_data,
            selected_car_ids: store.cars_physics.selected_car_ids
        }
    },
    computed: {
        track_data: function() {
            return tracks_data[this.track.id] as TrackData
        },
        car_id_options: function() {
            return store.cars_physics.selected_car_ids.map( car_id => ( {
                id: car_id,
                value: cars_data[car_id] as string
            } ) ).sort( ( a, b ) => a.value.toLowerCase() > b.value.toLowerCase() ? 1 : -1 )
        },
        is_last_track: function() {
            return this.index === store.tracks.length - 1
        }
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
            <table><tbody>
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

                <tr>
                    <td>Weather 2</td>
                    <td>
                        <select v-model={ this.track.weather2 }>
                            <option>Crisp</option>
                            <option>Hazy</option>
                            <option>No rain</option>
                            <option>Light rain</option>
                            <option>Heavy rain</option>
                            <option>No snow</option>
                            <option>Light snow</option>
                            <option>Heavy snow</option>
                            <option>Light fog</option>
                            <option>Heavy fog</option>
                        </select>
                    </td>
                </tr>

                <tr>
                    <td>Time of day</td>
                    <td>
                        <select v-model={ this.track.time_of_day }>
                            <option>Morning</option>
                            <option>Evening</option>
                            <option>Early evening</option>
                        </select>
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
                        <select v-model={ this.track.shortcut_check }>
                            <option>None</option>
                            <option>Low</option>
                        </select>
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
            </tbody></table>
        )
    }
} )
