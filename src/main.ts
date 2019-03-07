import Vue from 'vue'
import App from './App'

__webpack_public_path__ = 'http://127.0.0.1:8080/rbrcz_prototype/'

Vue.config.productionTip = false

const url_search_params = new URLSearchParams( window.location.search )

const act = url_search_params.get( 'act' )

const tournamentForm = document.getElementById( 'tournament' )

if ( tournamentForm ) {

    const parent = tournamentForm.parentElement

    if ( parent ) {
        const appContainer = document.createElement( 'div' )
        appContainer.id = 'tournament_revamped'
        parent.prepend( appContainer )

        new Vue( {
            render: h => h( App ),
        } ).$mount( '#tournament_revamped' )
    }
}
