<template>
    <div>
        <button v-on:click="addLeg" :disabled="canAddLeg === false">Add leg</button>
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
                    <td>Tyre change allowed</td>
                    <td>Setup change allowed</td>
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
                        <td style="text-align: center" ><input type="checkbox" v-model="track.tyre_change_allowed"></td>
                        <td style="text-align: center" ><input type="checkbox" v-model="track.setup_change_allowed"></td>
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
                        <td colspan="13" class="table-highlight">Service area ({{ track.service_time_mins }} min.)</td>
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
        sliderMax: function() {
            return this.tracks.length
        },

        maxStageDivider: function() {
            return this.legs.reduce( ( max, leg ) => leg.after_stage_divider > max ? leg.after_stage_divider : max, 0 )
        },

        canAddLeg: function() {
            return (
                this.tracks.length < 2 ||
                this.maxStageDivider < this.tracks.length - 2
            )
        },

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