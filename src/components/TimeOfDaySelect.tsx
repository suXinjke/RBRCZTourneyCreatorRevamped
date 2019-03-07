import * as tsx from 'vue-tsx-support'
import { trackSettings } from '../data/track-settings'

export default tsx.componentFactory.create( {
    name: 'TimeOfDaySelect',
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
            <select v-model={ this.track.time_of_day }>
            { this.settings.time_of_day.map( option =>
                <option key={ `timeOfDay${option.id}` } value={ option.id }>{ option.label }</option>
            ) }
            </select>
        )
    }
} )
