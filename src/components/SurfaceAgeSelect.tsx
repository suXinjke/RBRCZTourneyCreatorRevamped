import * as tsx from 'vue-tsx-support'

export default tsx.componentFactory.create( {
    name: 'SurfaceAgeSelect',
    props: {
        track: Object as () => SelectedTrack
    },

    render: function( h ) {
        return (
            <select v-model={ this.track.surface_age }>
                <option>New</option>
                <option>Normal</option>
                <option>Worn</option>
            </select>
        )
    }
} )
