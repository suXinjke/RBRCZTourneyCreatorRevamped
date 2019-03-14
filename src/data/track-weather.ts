import Vue from 'vue'
import { getElementByXpath, waitUntil } from '../util'

export const trackWeather = Vue.observable( {
    byId: {} as { [ index: string ]: TrackWeatherData[] },

    fetching: {} as { [ index: string ]: boolean },

    shouldBeThrottled() {
        return Object.values( this.fetching ).filter( value => value === true ).length >= 2
    },

    async fetchTrackWeather( track_id: string ) {
        if ( this.fetching[track_id] ) {
            await waitUntil( () => this.fetching[track_id] === false )
        }

        if ( this.byId[ track_id ] ) {
            return
        }

        if ( this.shouldBeThrottled() ) {
            await waitUntil( () => this.shouldBeThrottled() === false )
        }

        Vue.set( this.fetching, track_id, true )

        const res = await fetch( `/tools.php?act=show_textures&stage_id=${track_id}` )

        const html = await res.text()
        const doc = ( new DOMParser() ).parseFromString( html, 'text/html' )

        Vue.set( this.byId, track_id, [] )

        const weatherTable = getElementByXpath( doc, '/html/body/center/table[2]/tbody' )
        if ( weatherTable ) {

            for ( const row of weatherTable.children ) {
                const clickFunctionBody = row.getAttribute( 'ondblclick' )
                if ( !clickFunctionBody ) {
                    continue
                }

                const weather_pack = row.childNodes[0]
                const isOriginalWeatherPack = ( weather_pack.textContent || '' ) === 'Originální­ počasí­'
                if ( !isOriginalWeatherPack ) {
                    continue
                }

                const time_of_day = row.childNodes[1].textContent || ''
                const weather2 = row.childNodes[2].textContent || ''
                const clouds = row.childNodes[3].textContent || ''
                const remark = row.childNodes[4].textContent || ''

                const [ weather_pack_id, time_of_day_id, weather2_id, clouds_id ] = clickFunctionBody.match( /\d+/g ) || [ '', '', '', '' ]
                if ( !time_of_day_id || !weather2_id || !clouds_id ) {
                    continue
                }

                const data: TrackWeatherData = {
                    time_of_day: { id: time_of_day_id, label: time_of_day },
                    weather2: { id: weather2_id, label: weather2 },
                    clouds: { id: clouds_id, label: clouds },
                    remark: remark
                }

                this.byId[track_id].push( data )
            }

        }

        Vue.set( this.fetching, track_id, false )
    }
} )
