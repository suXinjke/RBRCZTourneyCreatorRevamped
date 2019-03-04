import * as tsx from 'vue-tsx-support'

export default tsx.componentFactory.create( {
    name: 'ServiceSelect',
    props: {
        track: Object as () => SelectedTrack
    },

    render: function( h ) {
        return (
            <select v-model={ this.track.service_time_mins }>
                <option value={ 0 }>No service</option>
                <option value={ 5 }>5 min.</option>
                <option value={ 10 }>10 min.</option>
                <option value={ 15 }>15 min.</option>
                <option value={ 20 }>20 min.</option>
                <option value={ 30 }>30 min.</option>
                <option value={ 60 }>60 min.</option>
                <option value={ 90 }>90 min.</option>
            </select>
        )
    }
} )
