<template>
    <table><tbody>
        <tr>
            <td>Original track name</td>
            <td>{{ track_data.name }}</td>
        </tr>

        <tr>
            <td>Distance</td>
            <td>{{ track_data.distance }} km</td>
        </tr>

        <tr>
            <td>Overriden track name</td>
            <td><input v-model="track.name" placeholder="None"/></td>
        </tr>

        <tr>
            <td>Surface type</td>
            <td>
                <select v-model="track.surface_type">
                    <option>Dry</option>
                    <option>Damp</option>
                    <option>Wet</option>
                </select>
            </td>
        </tr>

        <tr>
            <td>Surface age</td>
            <td>
                <select v-model="track.surface_age">
                    <option>New</option>
                    <option>Normal</option>
                    <option>Worn</option>
                </select>
            </td>
        </tr>

        <tr>
            <td>Weather</td>
            <td>
                <select v-model="track.weather">
                    <option>Good weather</option>
                    <option>Bad weather</option>
                    <option>Random weather</option>
                </select>
            </td>
        </tr>

        <tr>
            <td>Weather 2</td>
            <td>
                <select v-model="track.weather2">
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
                <select v-model="track.time_of_day">
                    <option>Morning</option>
                    <option>Evening</option>
                    <option>Early evening</option>
                </select>
            </td>
        </tr>

        <tr v-if="!is_last_track">
            <td>Service area after this stage</td>
            <td>
                <select v-model="track.service_time_mins">
                    <option v-bind:value="Number( 0 )">No service</option>
                    <option v-bind:value="Number( 5 )">5 min.</option>
                    <option v-bind:value="Number( 10 )">10 min.</option>
                    <option v-bind:value="Number( 15 )">15 min.</option>
                    <option v-bind:value="Number( 20 )">20 min.</option>
                    <option v-bind:value="Number( 30 )">30 min.</option>
                    <option v-bind:value="Number( 60 )">60 min.</option>
                    <option v-bind:value="Number( 90 )">90 min.</option>
                </select>
            </td>
        </tr>

        <tr v-if="!is_last_track && track.service_time_mins > 0">
            <td><label for="track.tyre_replacement_allowed">Allow tyres replacement at service area</label></td>
            <td><input type="checkbox" id="track.tyre_replacement_allowed" v-model="track.tyre_replacement_allowed"></td>
        </tr>

        <tr>
            <td><label for="track.setup_change_allowed">Allow setup change</label></td>
            <td><input type="checkbox" id="track.setup_change_allowed" v-model="track.setup_change_allowed"></td>
        </tr>


        <tr>
            <td><label for="track.tyre_change_allowed">Allow tyres type change</label></td>
            <td><input type="checkbox" id="track.tyre_change_allowed" v-model="track.tyre_change_allowed"></td>
        </tr>

        <tr>
            <td>Tyres</td>
            <td>
                <select v-model="track.tyres">
                    <option>Dry tarmac</option>
                    <option>Intermediate tarmac</option>
                    <option>Wet tarmac</option>
                    <option>Dry gravel</option>
                    <option>Intermediate gravel</option>
                    <option>Wet gravel</option>
                    <option>Snow</option>
                </select>
            </td>
        </tr>

        <tr>
            <td><label for="track.damage_change_allowed">Allow damage change</label></td>
            <td><input type="checkbox" id="track.damage_change_allowed" v-model="track.damage_change_allowed"></td>
        </tr>

        <tr>
            <td>Damage</td>
            <td>
                <select v-model="track.damage">
                    <option>Off</option>
                    <option>Safe</option>
                    <option>Reduced</option>
                    <option>Realistic</option>
                </select>
            </td>
        </tr>

        <tr>
            <td>Shortcuts checking</td>
            <td>
                <select v-model="track.shortcut_check">
                    <option>None</option>
                    <option>Low</option>
                </select>
            </td>
        </tr>

        <tr>
            <td><label for="track.superally">Allow superally in this stage</label></td>
            <td><input type="checkbox" id="track.superally" v-model="track.superally"></td>
        </tr>

        <tr>
            <td><label for="track.superally_hold">Superally hold this stage</label></td>
            <td><input type="checkbox" id="track.superally_hold" v-model="track.superally_hold"></td>
        </tr>

        <tr>
            <td><label for="track.retry_allowed">Allow to retry this stage</label></td>
            <td><input type="checkbox" id="track.retry_allowed" v-model="track.retry_allowed"></td>
        </tr>
    </tbody></table>
</template>

<script lang="ts">
import Vue from 'vue'
import store from './store'
import tracks_data from './data/tracks.json'
import cars_data from './data/cars.json'

export default Vue.extend( {
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
    }
} )
</script>