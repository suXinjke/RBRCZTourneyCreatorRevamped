import * as tsx from 'vue-tsx-support'
import { trackWeather } from '../data/track-weather'
import { problems } from '../data/track-problems'

export default tsx.componentFactory.create( {
    name: 'TrackWeatherSelect',
    props: {
        track: Object as () => SelectedTrack,
    },
    computed: {
        value: function() {
            const { time_of_day, weather2, clouds } = this.track
            return `${time_of_day},${weather2},${clouds}`
        },
        options: function() {
            return trackWeather.byId[this.track.id]
        },
        hasProblem: function() {
            return ( ( problems[this.track.id] && problems[this.track.id].time_of_day ) || [] ).includes( this.track.time_of_day )
        }
    },

    render: function( h ) {
        if ( !this.options ) {
            return <div>Loading...</div>
        }

        return (
            <div>
                <select value={ this.value } onChange={ ( e ) => {
                    if ( e.target ) {
                        const [ time_of_day_id, weather2_id, clouds_id ] = ( e.target as HTMLSelectElement ).value.split( ',' )
                        this.track.time_of_day = time_of_day_id
                        this.track.weather2 = weather2_id
                        this.track.clouds = clouds_id
                    }
                } }>
                { this.options.map( option => {
                    const value = `${option.time_of_day.id},${option.weather2.id},${option.clouds.id}`
                    return (
                        <option
                            key={ `t${option.time_of_day.id}w${option.weather2.id}c${option.clouds.id}` }
                            value={ value }
                            selected={ this.value === value }
                        >
                            { option.time_of_day.label }; { option.weather2.label }; { option.clouds.label } { option.remark ? `(${option.remark})` : '' }
                        </option>
                    )
                } ) }
                </select>
                <div class='error'>{ this.hasProblem ? `It's known that this time of day may crash the game unless the track is patched.` : '' }</div>
            </div>
        )
    }
} )
