import * as tsx from 'vue-tsx-support'
import { trackSettings } from '../data/track-settings'
import { problems } from '../data/track-problems'

export default tsx.componentFactory.create( {
    name: 'SurfaceAgeSelect',
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
        hasProblem: function( surface_age_id: string ) {
            return ( ( problems[this.track.id] && problems[this.track.id].surface_age ) || [] ).includes( surface_age_id )
        }
    },

    render: function( h ) {
        if ( !this.settings ) {
            return <div>Loading...</div>
        }

        return (
            <div>
                <select v-model={ this.track.surface_age }>
                { this.settings.surface_age.map( option =>
                    <option key={ `surface_age${option.id}` } value={ option.id }>
                        { option.label + ( this.tinyProblemDisplay && this.hasProblem( option.id ) ? ' (!)' : '' ) }
                    </option>
                ) }
                </select>
            { !this.tinyProblemDisplay &&
                <div class='error'>{ this.hasProblem( this.track.surface_age ) ? `It's known that this surface age may crash the game unless the track is patched.` : '' }</div>
            }
            </div>
        )
    }
} )
