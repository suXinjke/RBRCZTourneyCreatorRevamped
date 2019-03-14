import Vue from 'vue'
import { store } from '../store'
import { constants } from '../data/constants'
import { post, extractSelectOptions, getElementByXpath, waitUntil, formatDate, stringDateToCZDate } from '../util'

const now = new Date()
const nextDay = new Date( Number( now ) + 1000 * 60 * 60 * 24 * 1 )
const nextThreeDays = new Date( Number( now ) + 1000 * 60 * 60 * 24 * 3 )

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

        const dummy_post = store.tournamentPostOutput()
        dummy_post.tour_name = 'dummy'
        dummy_post.tour_from_date = stringDateToCZDate( formatDate( nextDay ) )
        dummy_post.tour_from_time = '00:00'

        dummy_post.tour_to_date = stringDateToCZDate( formatDate( nextThreeDays ) )
        dummy_post.tour_to_time = '23:59'

        dummy_post.tourstages = `${track_id};`
        if ( !dummy_post.PhysicsModId ) {
            dummy_post.PhysicsModId = constants.carPhysics[0].id
        }

        const response = await post( dummy_post, {
            page_selector: '2'
        } )

        const html = await response.text()
        const doc = ( new DOMParser() ).parseFromString( html, 'text/html' )

        const settings: TrackSettings = {
            surface_type: extractSelectOptions( getElementByXpath( doc, '//*[@id="SurfSel"]' ) ),
            surface_age: extractSelectOptions( getElementByXpath( doc, '//*[@id="SurfAgeSel"]' ) ),
            weather: extractSelectOptions( getElementByXpath( doc, '//*[@id="WeatherSel"]' ) ),
            weather2: extractSelectOptions( getElementByXpath( doc, '//*[@id="Weather2Sel"]' ) ),
            clouds: extractSelectOptions( getElementByXpath( doc, '//*[@id="CloudsSel"]' ) ),
            time_of_day: extractSelectOptions( getElementByXpath( doc, '//*[@id="TimeOfDaySel"]' ) ),
            tyres: extractSelectOptions( getElementByXpath( doc, '//*[@id="TyresSel"]' ) ),
            damage: extractSelectOptions( getElementByXpath( doc, '//*[@id="DamageSel"]' ) ),
            shortcut_check: extractSelectOptions( getElementByXpath( doc, '//*[@id="CutcheckerSel"]' ) )
        }

        Vue.set( this.byId, track_id, settings )

        Vue.set( this.fetching, track_id, false )
    }
} )
