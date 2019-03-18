import Vue from 'vue'
import { store } from '../store'
import { constants } from '../data/constants'
import { post, extractSelectOptions, getElementByXpath, waitUntil, formatDate, stringDateToCZDate } from '../util'

export const trackSettings = Vue.observable( {
    byId: {} as { [index: string]: TrackSettings },

    fetching: {} as { [index: string]: boolean },

    shouldBeThrottled() {
        return Object.values( this.fetching ).filter( value => value === true ).length >= 2
    },

    async fetchTrackSettings( track_id: string ) {
        if ( this.fetching[track_id] ) {
            await waitUntil( () => this.fetching[track_id] === false )
        }

        if ( this.byId[track_id] ) {
            return
        }

        if ( this.shouldBeThrottled() ) {
            await waitUntil( () => this.shouldBeThrottled() === false )
        }

        Vue.set( this.fetching, track_id, true )

        const dummy_post = store.tournamentDummyPostOutput( {
            tourstages: `${track_id};`
        } )

        const response = await post( dummy_post, {
            page_selector: '2'
        } )

        const html = await response.text()
        const doc = ( new DOMParser() ).parseFromString( html, 'text/html' )

        const tyres_select = getElementByXpath( doc, '//*[@id="TyresSel"]' )
        const tyres = extractSelectOptions( tyres_select )

        let tyres_recommended = tyres[0].id
        if ( tyres_select ) {
            for ( const child_node of tyres_select.children ) {
                const id = child_node.getAttribute( 'value' )
                if ( id && child_node.getAttribute( 'selected' ) !== null ) {
                    tyres_recommended = id
                    break
                }
            }
        }

        const settings: TrackSettings = {
            surface_type: extractSelectOptions( getElementByXpath( doc, '//*[@id="SurfSel"]' ) ),
            surface_age: extractSelectOptions( getElementByXpath( doc, '//*[@id="SurfAgeSel"]' ) ),
            weather: extractSelectOptions( getElementByXpath( doc, '//*[@id="WeatherSel"]' ) ),
            weather2: extractSelectOptions( getElementByXpath( doc, '//*[@id="Weather2Sel"]' ) ),
            clouds: extractSelectOptions( getElementByXpath( doc, '//*[@id="CloudsSel"]' ) ),
            time_of_day: extractSelectOptions( getElementByXpath( doc, '//*[@id="TimeOfDaySel"]' ) ),
            tyres,
            damage: extractSelectOptions( getElementByXpath( doc, '//*[@id="DamageSel"]' ) ),
            shortcut_check: extractSelectOptions( getElementByXpath( doc, '//*[@id="CutcheckerSel"]' ) ),

            tyres_recommended
        }

        Vue.set( this.byId, track_id, settings )

        Vue.set( this.fetching, track_id, false )
    }
} )
