import * as tsx from 'vue-tsx-support'

export default tsx.componentFactory.create( {
    name: 'TyreSelect',
    props: {
        track: Object as () => SelectedTrack
    },

    render: function( h ) {
        return (
            <select v-model={ this.track.tyres }>
                <option>Dry tarmac</option>
                <option>Intermediate tarmac</option>
                <option>Wet tarmac</option>
                <option>Dry gravel</option>
                <option>Intermediate gravel</option>
                <option>Wet gravel</option>
                <option>Snow</option>
            </select>
        )
    }
} )
