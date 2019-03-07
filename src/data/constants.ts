import Vue from 'vue'
import { getElementByXpath, extractSelectOptions } from '../util'

export const constants = Vue.observable( {
    superally: [] as SelectOption[],
    carPhysics: [] as SelectOption[],

    fetched: false,
    fetching: false,

    fetchTournamentConstants() {
        if ( this.fetching || this.fetched ) {
            return
        }

        this.fetching = true

        const superally_node = getElementByXpath( document, '//*[@id="SRallyPenaltySel"]' )
        this.superally = extractSelectOptions( superally_node )

        const car_physics_node = getElementByXpath( document, '//*[@id="PhysicsModId"]' )
        this.carPhysics = extractSelectOptions( car_physics_node )

        this.fetching = false
        this.fetched = true
    }
} )
