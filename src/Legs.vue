<template>
    <div>
        <table>
            <thead>
                <tr>
                    <td></td>
                    <td>Name</td>
                    <td>Weather</td>
                    <td>Tyres</td>
                    <td>Damage</td>
                    <td>Surface type</td>
                    <td>Surface age</td>
                    <td>Service</td>
                    <td>Tyre change</td>
                    <td>Setup change</td>
                    <td>Superally</td>
                    <td>Superally hold</td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                <template v-for="( track, index ) in tracks">
                    <tr :key="index">
                        <td>SS {{ index + 1 }}</td>
                        <td>
                            <input v-model="track.name" :placeholder="tracks_data[track.id].name" style="width: 94%;"/>
                        </td>
                        <td>
                            <select v-model="track.weather">
                                <option>Good weather</option>
                                <option>Bad weather</option>
                                <option>Random weather</option>
                            </select>
                        </td>
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
                        <td>
                            <select v-model="track.damage">
                                <option>Off</option>
                                <option>Safe</option>
                                <option>Reduced</option>
                                <option>Realistic</option>
                            </select>
                        </td>
                        <td>
                            <select v-model="track.surface_type">
                                <option>Dry</option>
                                <option>Damp</option>
                                <option>Wet</option>
                            </select>
                        </td>
                        <td>
                            <select v-model="track.surface_age">
                                <option>New</option>
                                <option>Normal</option>
                                <option>Worn</option>
                            </select>
                        </td>
                        <td style="text-align: center" >
                             <select v-model="track.service_time_mins">
                                <option v-bind:value="Number( 0 )">No</option>
                                <option v-bind:value="Number( 5 )">5 min.</option>
                                <option v-bind:value="Number( 10 )">10 min.</option>
                                <option v-bind:value="Number( 15 )">15 min.</option>
                                <option v-bind:value="Number( 20 )">20 min.</option>
                                <option v-bind:value="Number( 30 )">30 min.</option>
                                <option v-bind:value="Number( 60 )">60 min.</option>
                                <option v-bind:value="Number( 90 )">90 min.</option>
                            </select>
                        </td>
                        <td style="text-align: center" ><input type="checkbox" v-model="track.tyre_change_allowed"></td>
                        <td style="text-align: center" ><input type="checkbox" v-model="track.setup_change_allowed"></td>
                        <td style="text-align: center" ><input type="checkbox" v-model="track.superally"></td>
                        <td style="text-align: center" ><input type="checkbox" v-model="track.superally_hold"></td>
                        <td>
                            <button
                                :disabled="store.arrayCanMoveElement( tracks, index, -1 ) === false"
                                v-on:click="store.trackMoveUp( index )"
                            >
                                ^
                            </button>
                            <button
                                :disabled="store.arrayCanMoveElement( tracks, index, +1 ) === false"
                                v-on:click="store.trackMoveDown( index )"
                            >
                                v
                            </button>
                            <button v-on:click="store.trackRemove( index )">X</button>
                        </td>
                    </tr>
                    <tr v-if="track.service_time_mins > 0" :key="index + 'service'">
                        <td colspan="13" class="table-highlight">Service area ({{ track.service_time_mins }} min.) / <input type="checkbox" v-model="track.tyre_replacement_allowed"> Tyre replacement</td>
                    </tr>
                    <tr v-if="track.superally_hold" :key="index + 'superally'">
                        <td colspan="13" class="table-highlight">Superally</td>
                    </tr>
                    <template v-for="( leg, leg_index ) in legs">
                        <tr v-if="index === leg.after_stage_divider" :key="index + ' ' + leg + 'leg'">
                            <td colspan="13" class="table-highlight" style="text-align: center">
                                <button
                                    v-on:click="moveLegUp( leg.after_stage_divider )"
                                    :disabled="canMoveLegUp( leg.after_stage_divider ) === false"
                                >
                                    ^^^
                                </button>
                                Leg {{ leg_index + 1 }}
                                <input type="date" v-model="leg.date">
                                <input type="time" v-model="leg.time">
                                <button v-on:click="removeLeg( leg.after_stage_divider )">Remove</button>
                                Leg {{ leg_index + 2 }}
                                <button
                                    v-on:click="moveLegDown( leg.after_stage_divider )"
                                    :disabled="canMoveLegDown( leg.after_stage_divider ) === false"
                                >
                                    vvv
                                </button>
                                <div v-if="errors[leg.after_stage_divider]" class="error">
                                    {{ errors[leg.after_stage_divider] }}
                                </div>
                            </td>
                        </tr>
                    </template>
                </template>
            </tbody>
        </table>

        <table style="margin: 0 auto;">
            <thead><tr>
                <td>Leg</td>
                <td>Stage</td>
                <td>Date from</td>
                <td>Date to</td>
            </tr></thead>
            <tbody v-if="legs.length > 0 ">
                <template v-for="( leg, leg_index ) in legs">
                    <tr :key="leg_index + ' ' + leg + 'leg'">
                        <td>{{ leg_index + 1 }}</td>

                        <td v-if="leg_index === 0">1 - {{ leg.after_stage_divider + 1 }}</td>
                        <td v-else-if="leg_index === legs.length - 1">{{ legs[leg_index-1].after_stage_divider + 2 }} - {{ leg.after_stage_divider + 1 }}</td>
                        <td v-else>{{ legs[leg_index-1].after_stage_divider + 2 }} - {{ leg.after_stage_divider + 1 }}</td>

                        <td v-if="leg_index === 0">{{ store.tournament.from_date }} {{ store.tournament.from_time }}</td>
                        <td v-else>{{ legs[leg_index-1].date }} {{ legs[leg_index-1].time }}</td>

                        <td>{{ leg.date }} {{ leg.time }}</td>
                    </tr>
                </template>
                <tr>
                    <td>{{ legs.length + 1 }}</td>

                    <td>{{ lastLeg.after_stage_divider + 2 }} - {{ store.tracks.length }}</td>

                    <td>{{ lastLeg.date }} {{ lastLeg.time }}</td>

                    <td>{{ store.tournament.to_date }} {{ store.tournament.to_time }}</td>
                </tr>
            </tbody>
            <tbody v-else style="text-align: center;">
                <td colspan="4">No legs created</td>
            </tbody>
            <tfoot><tr><td colspan="4" style="text-align: center;">
                <button v-on:click="addLeg" :disabled="canAddLeg === false">Add leg</button>
            </td></tr></tfoot>
        </table>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import store, { formatDate, formatTime } from './store'
import tracks_data from './data/tracks.json'

export default Vue.extend( {
    name: 'Legs',
    data: function() {
        return {
            tracks_data,

            tracks: store.tracks,
            legs: store.legs,

            store
        }
    },
    props: {
        errors: Object as () => {
            [index: string]: string
        }
    },
    computed: {
        maxStageDivider: function() {
            return this.legs.reduce( ( max, leg ) => leg.after_stage_divider > max ? leg.after_stage_divider : max, 0 )
        },

        canAddLeg: function() {
            return (
                this.tracks.length >= 2 &&
                ( this.legs.length === 0 || this.maxStageDivider < this.tracks.length - 2 )
            )
        },

        lastLeg: function() {
            return this.legs[this.legs.length - 1]
        }
    },
    methods: {
        addLeg: function() {
            if ( this.canAddLeg === false ) {
                return
            }

            const now = new Date()
            const nextThreeHours = new Date( Number( now ) + 1000 * 60 * 60 * 3 )
            const nextSixHours = new Date( Number( now ) + 1000 * 60 * 60 * 6 )

            this.legs.push( {
                after_stage_divider: this.legs.length === 0 ? 0 : this.maxStageDivider + 1,

                date: formatDate( nextThreeHours ),
                time: formatTime( nextThreeHours )
            } )
        },

        canMoveLegUp: function( stage_split: number ) {
            return (
                stage_split > 0 &&
                this.legs.find( leg => leg.after_stage_divider === stage_split - 1 ) === undefined
            )
        },

        moveLegUp: function( stage_split: number ) {
            if ( this.canMoveLegUp( stage_split ) === false ) {
                return
            }

            for ( const leg of this.legs ) {
                if ( leg.after_stage_divider === stage_split ) {
                    leg.after_stage_divider--
                    break
                }
            }
        },

        canMoveLegDown: function( stage_split: number ) {
            return (
                stage_split < this.tracks.length - 2 &&
                this.legs.find( leg => leg.after_stage_divider === stage_split + 1 ) === undefined
            )
        },

        moveLegDown: function( stage_split: number ) {
            if ( this.canMoveLegDown( stage_split ) === false ) {
                return
            }

            for ( const leg of this.legs ) {
                if ( leg.after_stage_divider === stage_split ) {
                    leg.after_stage_divider++
                    break
                }
            }
        },

        removeLeg: function( stage_split: number ) {
            for ( let i = 0 ; i < this.legs.length ; i++ ) {
                if ( this.legs[i].after_stage_divider === stage_split ) {
                    this.legs.splice( i, 1 )
                    break
                }
            }
        }
    }
} )
</script>