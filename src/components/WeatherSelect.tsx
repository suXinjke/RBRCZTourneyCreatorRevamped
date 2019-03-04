import * as tsx from 'vue-tsx-support'

export default tsx.componentFactory.create( {
    name: 'WeatherSelect',
    props: {
        track: Object as () => SelectedTrack
    },

    render: function( h ) {
        return (
            <select v-model={ this.track.weather }>
                <option>Good weather</option>
                <option>Bad weather</option>
                <option>Random weather</option>
            </select>
        )
    }
} )
