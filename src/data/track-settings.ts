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

    async fetchTrackSettings( track_id: string, track_index: number ) {
        if ( this.fetching[track_id] || this.byId[track_id] ) {
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
        if ( !dummy_post.PhysicsModId ) {
            dummy_post.PhysicsModId = constants.carPhysics[0].id
        }

        const response = await post( dummy_post, {
            page_selector: ( 2 + track_index ).toString()
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

        store.tracks[track_index].surface_type = settings.surface_type[0].id
        store.tracks[track_index].surface_age = settings.surface_age[0].id
        store.tracks[track_index].weather = settings.weather[0].id
        store.tracks[track_index].weather2 = settings.weather2[0].id
        store.tracks[track_index].clouds = settings.clouds[0].id
        store.tracks[track_index].time_of_day = settings.time_of_day[0].id
        store.tracks[track_index].tyres = settings.tyres[0].id
        store.tracks[track_index].damage = settings.damage[0].id
        store.tracks[track_index].shortcut_check = settings.shortcut_check[0].id

        Vue.set( this.byId, track_id, settings )

        Vue.set( this.fetching, track_id, false )
    }
} )
