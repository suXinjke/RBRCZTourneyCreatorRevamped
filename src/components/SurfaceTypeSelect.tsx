import * as tsx from 'vue-tsx-support'

export default tsx.componentFactory.create( {
    name: 'SurfaceTypeSelect',
    props: {
        track: Object as () => SelectedTrack
    },

    render: function( h ) {
        return (
            <select v-model={ this.track.surface_type }>
                <option>Dry</option>
                <option>Damp</option>
                <option>Wet</option>
            </select>
        )
    }
} )
