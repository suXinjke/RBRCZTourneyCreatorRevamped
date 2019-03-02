<template>
    <div id="app">
        <table><tbody>
            <tr>
                <td class="nav-buttons">
                    <button v-on:click="current_page = 'tournament'" :class="{ active: current_page === 'tournament', error: hasErrors( tournament_errors ) }">Tournament</button>
                    <button v-on:click="current_page = 'cars'" :class="{ active: current_page === 'cars', error: hasErrors( cars_errors ) }">Cars / Physics</button>
                    <button v-on:click="current_page = 'track_list'" :class="{ active: current_page === 'track_list', error: hasErrors( tracks_errors ) }" style="margin-bottom: 8px">Tracks</button>
                    <button
                        v-for="( track, index ) in store.tracks" :key="`track${index}`"
                        v-on:click="current_page = `track`; track_index = index"
                        :class="{ active: current_page === 'track' && track_index == index }"
                    >
                        SS {{ index + 1 }} - {{ tracks_data[track.id].name }}  {{ track.name ? `(${track.name})` : '' }}
                    </button>

                    <button v-on:click="current_page = 'legs'" :class="{ active: current_page === 'legs', error: hasErrors( legs_errors ) }" style="margin-top: 8px">
                        Schedule and legs
                    </button>
                    <button v-on:click="current_page = 'json'" :class="{ active: current_page === 'json' }">
                        JSON info
                    </button>

                    <button :disabled="true" style="margin-top: 8px">
                        {{ hasErrors( { ...tournament_errors, ...cars_errors, ...tracks_errors, ...legs_errors } ) ? "Can't send data due to errors" : "This button would send the data" }}
                    </button>
                </td>
                <td style="vertical-align: top;">
                    <Tournament v-if="current_page === 'tournament'" :errors="tournament_errors"/>
                    <Cars v-if="current_page === 'cars'" :errors="cars_errors"/>
                    <TrackList v-if="current_page === 'track_list'" :errors="tracks_errors"/>
                    <Track v-if="current_page === 'track'" :track="store.tracks[track_index]" :index="track_index"/>
                    <Legs v-if="current_page === 'legs'" :errors="legs_errors"/>

                    <div v-if="current_page === 'json'">
                        <div>
                            <button v-on:click="onSave( 1 )">Save state 1</button>
                            <button v-on:click="onSave( 2 )">Save state 2</button>
                            <button v-on:click="onSave( 3 )">Save state 3</button>
                        </div>
                        <div>
                            <button v-on:click="onLoad( 1 )">Load state 1</button>
                            <button v-on:click="onLoad( 2 )">Load state 2</button>
                            <button v-on:click="onLoad( 3 )">Load state 3</button>
                        </div>
                        <pre>{{ JSON.stringify( store, null, 4 ).trim() }}</pre>
                    </div>
                </td>
            </tr>
        </tbody></table>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Tournament from './Tournament.vue'
import Cars from './Cars.vue'
import TrackList from './TrackList.vue'
import Track from './Track.vue'
import Legs from './Legs.vue'
import store from './store'
import tracks_data from './data/tracks.json'

export default Vue.extend( {
    name: 'app',
    components: {
        Tournament,
        Cars,
        TrackList,
        Track,
        Legs
    },
    data: function() {
        return {
            current_page: 'legs',
            track_index: 0,

            tracks_data,

            store: store
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
            return {
                selected_cars: this.store.cars_physics.selected_car_ids.length === 0 ? 'Must select atleast one car' : '',
                car_physics: this.store.cars_physics.car_physics_id.length === 0 ? 'Must select car physics' : '',
                track_physics: this.store.cars_physics.track_physics_id.length === 0 ? 'Must select track physics' : ''
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
                const { tournament } = this.store
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
        onSave: function( slot: number ) {
            localStorage.setItem( `save${slot}`, JSON.stringify( this.store ) )
        },
        onLoad: function( slot: number ) {
            let data: any = localStorage.getItem( `save${slot}` )
            if ( !data ) {
                return
            }
            data = JSON.parse( data )

            Object.assign( this.store, data )
        },
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
    }
} )
</script>

<style lang="scss">
* {
    font-family: Verdana, Geneva, Tahoma, sans-serif
}

pre {
    font-family: 'Courier New', Courier, monospace
}

.nav-buttons {
    vertical-align: top;

    button {
        display: block;
        text-align: left;
        width: 200px;

        &.active {
            font-weight: bold;
        }
    }
}

.select-buttons {
    vertical-align: middle;
    button {
        display: block;
        width: 200px;
    }
}

input, textarea, select {
    width: 100%;
}

input[type="checkbox"], input[type="radio"], input[type="date"], input[type="time"] {
    width: auto;
}

.table-highlight {
    text-align: center;
    font-weight: bold;
    background-color: lightgray;
}

.error {
    color: rgb(230, 0, 0);
}
</style>
