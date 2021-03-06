import * as tsx from 'vue-tsx-support'
import { trackSettings } from '../data/track-settings'

export default tsx.componentFactory.create( {
    name: 'DamageSelect',
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
            <select v-model={ this.track.damage }>
            { this.settings.damage.map( option =>
                <option key={ `damage${option.id}` } value={ option.id }>{ option.label }</option>
            ) }
            </select>
        )
    }
} )
