import * as tsx from 'vue-tsx-support'
import { trackWeather } from '../data/track-weather'

export default tsx.componentFactory.create( {
    name: 'TrackWeatherSelect',
    props: {
        track: Object as () => SelectedTrack,
    },
    computed: {
        options: function() {
            return trackWeather.byId[this.track.id]
        }
    },

    render: function( h ) {
        if ( !this.options ) {
            return <div>Loading...</div>
        }

        return (
            <select onChange={ ( e ) => {
                if ( e.target ) {
                    const [ time_of_day_id, weather2_id, clouds_id ] = ( e.target as HTMLSelectElement ).value.split( ',' )
                    this.track.time_of_day = time_of_day_id
                    this.track.weather2 = weather2_id
                    this.track.clouds = clouds_id
                }
            } }>
            { this.options.map( option =>
                <option key={ `t${option.time_of_day.id}w${option.weather2.id}c${option.clouds.id}` } value={ `${option.time_of_day.id},${option.weather2.id},${option.clouds.id}` }>
                    { option.time_of_day.label }; { option.weather2.label }; { option.clouds.label } { option.remark ? `(${option.remark})` : '' }
                </option>
            ) }
            </select>
        )
    }
} )
