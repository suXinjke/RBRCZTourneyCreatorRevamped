import * as tsx from 'vue-tsx-support'

export default tsx.componentFactory.create( {
    name: 'DamageSelect',
    props: {
        track: Object as () => SelectedTrack
    },

    render: function( h ) {
        return (
            <select v-model={ this.track.damage }>
                <option>Off</option>
                <option>Safe</option>
                <option>Reduced</option>
                <option>Realistic</option>
            </select>
        )
    }
} )
