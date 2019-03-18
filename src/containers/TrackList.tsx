import * as tsx from 'vue-tsx-support'
import { store } from '../store'
import { tracks } from '../data/tracks'

export default tsx.componentFactory.create( {
    name: 'TrackList',
    data: function() {
        return {
            selected_track_groups: [ '' ] as string[],

            available_tracks_filter: '',
            available_tracks_selected_ids: [] as string[],

            tracks_selected_indexes: [] as number[],

            tracks: store.tracks,
            tracks_data: tracks.byId
        }
    },

    props: {
        errors: Object as () => {
            selected_tracks: string
        }
    },

    computed: {
        available_track_groups: function() {
            const country_array = Object.keys( this.tracks_data ).reduce( ( countries, key ) => {
                const { country } = this.tracks_data[key]
                return countries.includes( country ) ? countries : countries.concat( country )
            }, [] as string[] ).sort( ( a, b ) => a > b ? 1 : -1 )
            const surface_array = [
                'Gravel',
                'Tarmac',
                'Snow'
            ]

            return [
                ...surface_array,
                ...country_array
            ]
        },

        available_tracks_select: function() {
            return Object.keys( this.tracks_data ).map( key => ( {
                id: key,
                value: this.tracks_data[key]
            } ) )
            .sort( ( a, b ) => a.value.name > b.value.name ? 1 : -1 )
            .filter( option =>
                this.selected_track_groups.includes( '' ) ||
                this.selected_track_groups.includes( option.value.country ) ||
                this.selected_track_groups.includes( option.value.surface )
            )
            .filter( option => this.available_tracks_filter === '' || option.value.name.toLowerCase().indexOf( this.available_tracks_filter.toLowerCase() ) !== -1 )
        },

        total_distance: function() {
            return this.tracks.reduce( ( sum, track ) => sum + this.tracks_data[track.id].distance, 0 ).toFixed( 1 )
        },

        isLoading: function() {
            return tracks.fetching
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
    },

    render: function( h ) {
        if ( this.isLoading ) {
            return (
                <div>Loading track list...</div>
            )
        }
        return (
            <table><tbody><tr>
                <td>
                    <div>Track groups</div>
                    <select v-model={ this.selected_track_groups } multiple style='height: 400px;'>
                        <option value=''>All tracks</option>
                    { this.available_track_groups.map( group =>
                        <option value={ group } key={ group }>{ group }</option>
                    ) }
                    </select>
                </td>
                <td>
                    <div>Tracks</div>
                    <div>
                        <input style='width: 100%;' v-model={ this.available_tracks_filter } placeholder='Search...'/>
                    </div>
                    <select v-model={ this.available_tracks_selected_ids } multiple style='height: 382px; width: 200px'>
                    { this.available_tracks_select.map( option =>
                        <option value={ option.id } key={ option.id } onDblclick={ this.addSelected }>{ option.value.name }</option>
                    ) }
                    </select>
                </td>
                <td class='select-buttons'>
                    <button onClick={ () => this.moveSelected( -1 ) } style='text-align: left; margin-bottom: 16px;'>^^^ Move selected</button>

                    <button onClick={ this.addSelected } style='text-align: left;'>Add selected ></button>
                    <button onClick={ this.addRandom } style='text-align: left;'>Add random ></button>
                    <button onClick={ this.addAll } style='text-align: left;'>Add all >></button>
                    <button onClick={ this.removeSelected } style='text-align: right;'>&lt; Remove selected</button>
                    <button onClick={ this.removeAll } style='text-align: right;'>&lt;&lt; Remove all</button>

                    <button onClick={ () => this.moveSelected( +1 ) } style='text-align: right; margin-top: 16px;'>Move selected vvv</button>
                </td>
                <td>
                    <div>Selected tracks</div>
                    <select v-model={ this.tracks_selected_indexes } multiple style='height: 400px; width: 200px' onDblclick={ this.removeSelected }>
                    { this.errors.selected_tracks &&
                        <option class='error'>{ this.errors.selected_tracks }</option>
                    }
                    { this.tracks.map( ( track, index ) =>
                        <option value={ index } key={`${index}${track.id}`}>{ index + 1 } - { this.tracks_data[track.id].name }</option>
                    ) }
                    </select>
                    <div>Total distance: { this.total_distance } km</div>
                </td>
            </tr></tbody></table>
        )
    }
} )
