import * as tsx from 'vue-tsx-support'
import { trackSettings } from '../data/track-settings'

export default tsx.componentFactory.create( {
    name: 'SurfaceAgeSelect',
    props: {
        track: Object as () => SelectedTrack,
    },
    computed: {
        settings: function() {
            return trackSettings.byId[this.track.id]
        }
    },

    render: function( h ) {
        if ( !this.settings ) {
            return <div>Loading...</div>
        }

        return (
            <select v-model={ this.track.surface_age }>
            { this.settings.surface_age.map( option =>
                <option key={ `surface_age${option.id}` } value={ option.id }>{ option.label }</option>
            ) }
            </select>
        )
    }
} )
