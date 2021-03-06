import * as tsx from 'vue-tsx-support'
import { trackSettings } from '../data/track-settings'

export default tsx.componentFactory.create( {
    name: 'WeatherTwoSelect',
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
            <select v-model={ this.track.weather2 }>
            { this.settings.weather2.map( option =>
                <option key={ `weather_two_${option.id}` } value={ option.id }>{ option.label }</option>
            ) }
            </select>
        )
    }
} )
