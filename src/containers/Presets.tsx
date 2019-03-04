import * as tsx from 'vue-tsx-support'
import { store } from '../store'

export default tsx.componentFactory.create( {
    name: 'Presets',

    data: function() {
        return {
            store,

            saveNames: ( new Array( 10 ) ).fill( undefined )
        }
    },

    methods: {
        save: function( slot: number, name: string | null ) {
            if ( !name || !name.trim() ) {
                return
            }
            this.saveNames = this.saveNames.map( ( value, index ) => index !== slot ? value : name )
            localStorage.setItem( `save${slot}`, JSON.stringify( this.store ) )
        },
        load: function( slot: number ) {
            const data: any = localStorage.getItem( `save${slot}` )
            if ( !data ) {
                return
            }

            Object.assign( this.store, JSON.parse( data ) )
        },
    },

    mounted: function() {
        const items = localStorage.getItem( 'save_names' )
        if ( items ) {
            this.saveNames = JSON.parse( items )
        }
    },

    watch: {
        saveNames: function() {
            localStorage.setItem( 'save_names', JSON.stringify( this.saveNames ) )
        }
    },

    render: function( h ) {
        return (
            <div>
                <div>{ 'Save slot: ' }
                { ( new Array( 10 ) ).fill( 0 ).map( ( nothing, index ) =>
                    <button onClick={ () => this.save( index, prompt( 'Enter the slot save name' ) ) }>{ index + 1 }</button>
                ) }
                </div>
                <div>{ 'Load slot: ' }
                { ( this.saveNames.map( ( saveName, index ) =>
                    <button disabled={ Boolean( saveName ) === false }>{ index + 1 } { saveName ? `- ${saveName}` : '' }</button>
                ) ) }
                </div>
                <table>
                    <thead>
                        <tr>
                            <td>JSON Data</td>
                            <td>Output data</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><pre>{ JSON.stringify( this.store, null, 4 ).trim() }</pre></td>
                            <td><pre>* Under construction *</pre></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
} )
