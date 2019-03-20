import Vue from 'vue'
import { store } from '../store'
import { post, extractSelectOptions, getElementByXpath, cacheGet, cacheStore } from '../util'

export const cars = Vue.observable( {
    cacheChecked: false,

    byId: {} as { [index: string]: string },

    carPacks: {} as { [index: string]: { [index: string]: { name: string, cars: string[] } } },

    trackPhysics: {} as { [index: string]: SelectOption[] },

    fetching: {} as { [index: string]: boolean },

    async fetchCars( car_physics_id: string ) {
        if ( !this.cacheChecked ) {
            const cachedCars = cacheGet( 'cars' )
            if ( cachedCars ) {
                const { byId, carPacks, trackPhysics } = JSON.parse( cachedCars )
                Vue.set( this, 'byId', byId )
                Vue.set( this, 'carPacks', carPacks )
                Vue.set( this, 'trackPhysics', trackPhysics )
            }

            this.cacheChecked = true
        }

        if ( this.fetching[car_physics_id] || this.trackPhysics[car_physics_id] || this.carPacks[car_physics_id] ) {
            return
        }

        this.fetching[car_physics_id] = true

        Vue.set( this.carPacks, car_physics_id, {} )

        const dummy_post = store.tournamentDummyPostOutput( {
            PhysicsModId: car_physics_id,
            tourstages: '10;'
        } )

        const response = await post( dummy_post, {
            page_selector: '1'
        } )

        const html = await response.text()
        const doc = ( new DOMParser() ).parseFromString( html, 'text/html' )

        const car_pack_node = getElementByXpath( doc, '//*[@id="ModsPacksSel"]' )
        const car_pack_options = extractSelectOptions( car_pack_node )
        car_pack_options.forEach( car_pack_option => {
            Vue.set( this.carPacks[car_physics_id], car_pack_option.id, {
                name: car_pack_option.label,
                cars: []
            } )
        } )

        const car_regexp = /carsInfo\[\d+\] = new Array\("([^"]+)",\s+"([^"]+)",\s+"([^"]+)"/g
        car_regexp.exec( html )
        let matches = car_regexp.exec( html )

        while ( matches !== null ) {
            const car_id = matches[1]
            const car_name = matches[2]
            const car_pack_ids = matches[3].split( ',' )

            Vue.set( this.byId, car_id, car_name )

            car_pack_ids.forEach( car_pack_id => {
                if ( this.carPacks[car_physics_id][car_pack_id] ) {
                    this.carPacks[car_physics_id][car_pack_id].cars.push( car_id )
                }
            } )

            matches = car_regexp.exec( html )
        }

        const physics_node = getElementByXpath( doc, '//*[@id="ModsSel"]' )
        const physics = extractSelectOptions( physics_node ).filter( mod => !this.byId[mod.id] )
        Vue.set( this.trackPhysics, car_physics_id, physics )

        cacheStore( 'cars', JSON.stringify( { byId: this.byId, carPacks: this.carPacks, trackPhysics: this.trackPhysics } ), 60 * 60 * 24 )

        this.fetching[car_physics_id] = false
    }
} )
