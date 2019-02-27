<template>
    <table><tbody><tr>
        <td>
            Countries
            <select v-model="selected_countries" multiple style="height: 400px; min-width: 140px">
                <option value="">All countries</option>
                <option v-for="option in available_countries" v-bind:value="option" :key="option">
                    {{ option }}
                </option>
            </select>
        </td>
        <td>
            Tracks
            <input v-model="available_tracks_filter" placeholder="Search..."/>
            <select v-model="available_tracks_selected_ids" multiple style="height: 376px; min-width: 140px">
                <option
                    v-for="option in available_tracks_select" v-bind:value="option.id" :key="option.id"
                    :title="option.value.name" v-on:dblclick="addSelected"
                >
                    {{ option.value.name }}
                </option>
            </select>
        </td>
        <td class="select-buttons">
            <button v-on:click="moveSelected( -1 )" style="text-align: left; margin-bottom: 16px;">
                ^^^ Move selected
            </button>

            <button v-on:click="addSelected" style="text-align: left;">Add selected ></button>
            <button v-on:click="addRandom" style="text-align: left;">Add random ></button>
            <button v-on:click="addAll" style="text-align: left;">Add all >></button>
            <button v-on:click="removeSelected" style="text-align: right;">&lt; Remove selected</button>
            <button v-on:click="removeAll" style="text-align: right;">&lt;&lt; Remove all</button>

            <button v-on:click="moveSelected( +1 )" style="text-align: right; margin-top: 16px;">
                Move selected vvv
            </button>
        </td>
        <td>
            Selected tracks
            <select v-model="tracks_selected_indexes" multiple style="min-width: 200px; height: 400px" v-on:dblclick="removeSelected">
                <option v-for="( track, index ) in tracks" v-bind:value="index" :key="`${index}${track.id}`">
                    {{ index + 1 }} - {{ tracks_data[track.id].name }}
                </option>
            </select>
            <span v-if="errors.selected_tracks" class="error">{{ errors.selected_tracks }}</span>
            <span v-else>Total distance: {{ total_distance }} km</span>
        </td>
    </tr></tbody></table>
</template>

<script lang="ts">
import Vue from 'vue'
import store from './store'
import tracks_data from './data/tracks.json'

export default Vue.extend( {
    name: 'TrackList',
    data: function() {
        return {
            selected_countries: [ '' ] as string[],

            available_tracks_filter: '',
            available_tracks_selected_ids: [] as string[],

            tracks_selected_indexes: [] as number[],

            tracks: store.tracks,
            tracks_data
        }
    },

    props: {
        errors: Object as () => {
            selected_tracks: string
        }
    },

    computed: {
        available_countries: function() {
            return Object.keys( tracks_data ).reduce( ( countries, key ) => {
                const { country } = tracks_data[key]
                return countries.includes( country ) ? countries : countries.concat( country )
            }, [] as string[] ).sort( ( a, b ) => a > b ? 1 : -1 )
        },

        available_tracks_select: function() {
            return Object.keys( tracks_data ).map( key => ( {
                id: key,
                value: tracks_data[key]
            } ) )
            .sort( ( a, b ) => a.value.name > b.value.name ? 1 : -1 )
            .filter( option =>
                this.selected_countries.includes( '' ) ||
                this.selected_countries.includes( option.value.country )
            )
            .filter( option => this.available_tracks_filter === '' || option.value.name.toLowerCase().indexOf( this.available_tracks_filter.toLowerCase() ) !== -1 )
        },

        total_distance: function() {
            return this.tracks.reduce<number>( ( sum, track ) => sum + tracks_data[track.id].distance, 0 ).toFixed( 1 )
        }
    },

    methods: {

        addToSelected: function( track_ids: string[] ) {
            store.trackAdd( track_ids )
        },

        addSelected: function() {
            this.addToSelected( this.available_tracks_selected_ids )
        },

        moveSelected: function( offset: number ) {
            const sorted_indexes = this.tracks_selected_indexes.sort( ( a, b ) => ( offset >= 0 ? a > b : a < b ) ? -1 : 1 )

            for ( let index = 0 ; index < sorted_indexes.length ; index++ ) {
                const selected_index = sorted_indexes[index]
                if ( store.trackMove( selected_index, offset ) ) {
                    this.tracks_selected_indexes[index] += offset
                } else {
                    break
                }
            }
        },

        addRandom: function() {
            const random_track_id = this.available_tracks_select[ Math.floor( Math.random() * this.available_tracks_select.length ) ].id
            if ( !random_track_id ) {
                return
            }
            this.addToSelected( [ random_track_id ] )
        },

        addAll: function() {
            this.addToSelected( this.available_tracks_select.map( option => option.id ) )
        },

        removeSelected: function() {
            this.tracks_selected_indexes.sort( ( a, b ) => a > b ? -1 : 1 ).forEach( index => {
                store.trackRemove( index )
            } )
        },

        removeAll: function() {
            this.tracks.splice( 0 )
        },
    }
} )
</script>