import Vue from 'vue'
import { store } from '../store'
import { post, extractSelectOptions, getElementByXpath, cacheGet, cacheStore } from '../util'

export const licenses = Vue.observable( {
    cacheChecked: false,

    options: [] as SelectOption[],

    fetching: false,

    // NOTE: dumb car_physics_id here but licenses are located on Cars page
    async fetchLicenses( car_physics_id: string ) {
        if ( !this.cacheChecked ) {
            const cachedLicenses = cacheGet( 'licenses' )
            if ( cachedLicenses ) {
                Vue.set( this, 'options', JSON.parse( cachedLicenses ) )
            }

            this.cacheChecked = true
        }

        if ( this.fetching ) {
            return
        }

        this.fetching = true

        const dummy_post = store.tournamentDummyPostOutput( {
            PhysicsModId: car_physics_id,
            tourstages: '10;'
        } )

        const response = await post( dummy_post, {
            page_selector: '1'
        } )

        const html = await response.text()
        const doc = ( new DOMParser() ).parseFromString( html, 'text/html' )

        const licenses_node = getElementByXpath( doc, '//*[@id="LicSel"]' )
        this.options = extractSelectOptions( licenses_node )

        cacheStore( 'licenses', JSON.stringify( this.options ), 60 * 60 * 24 )

        this.fetching = false
    }
} )
