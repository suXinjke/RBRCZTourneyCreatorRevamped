import * as tsx from 'vue-tsx-support'
import { trackSettings } from '../data/track-settings'
import { problems } from '../data/track-problems'

export default tsx.componentFactory.create( {
    name: 'SurfaceTypeSelect',
    props: {
        track: Object as () => SelectedTrack,
        tinyProblemDisplay: Boolean
    },
    computed: {
        settings: function() {
            return trackSettings.byId[this.track.id]
        }
    },
    methods: {
        hasProblem: function( surface_type_id: string ) {
            return ( ( problems[this.track.id] && problems[this.track.id].surface_type ) || [] ).includes( surface_type_id )
        }
    },

    render: function( h ) {
        if ( !this.settings ) {
            return <div>Loading...</div>
        }

        return (
            <div>
                <select v-model={ this.track.surface_type }>
                { this.settings.surface_type.map( option =>
                    <option key={ `surface_type${option.id}` } value={ option.id }>
                        { option.label + ( this.tinyProblemDisplay && this.hasProblem( option.id ) ? ' (!)' : '' ) }
                    </option>
                ) }
                </select>
            { !this.tinyProblemDisplay &&
                <div class='error'>{ this.hasProblem( this.track.surface_type ) ? `It's known that this surface type may crash the game unless the track is patched.` : '' }</div>
            }
            </div>
        )
    }
} )
