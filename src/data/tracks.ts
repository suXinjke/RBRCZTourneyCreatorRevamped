import Vue from 'vue'
import { getElementByXpath } from '../util'

export const tracks = Vue.observable( {
    byId: {} as { [index: string]: TrackData },

    fetching: false,

    async fetchTracks() {
        if ( this.fetching || Object.keys( this.byId ).length > 0 ) {
            return
        }

        this.fetching = true

        const res = await fetch( '/index.php?act=rbrtracks&setlng=eng' )

        const text = await res.text()
        const doc = new DOMParser().parseFromString( text, 'text/html' )

        const track_rows = getElementByXpath( doc, '/html/body/table/tbody/tr/td/table[3]/tbody/tr[1]/td[2]/table/tbody/tr[2]' )

        let row: Node | null = track_rows
        while ( row ) {
            const id = row.childNodes[0].textContent
            if ( id ) {
                const track: TrackData = {
                    id,
                    name: row.childNodes[1].textContent || '',
                    country: row.childNodes[2].textContent || '',
                    surface: row.childNodes[3].textContent || '',
                    distance: row.childNodes[4].textContent ? Number( row.childNodes[4].textContent.replace( ' km', '' ) ) : 0,
                    shakedown_allowed: row.childNodes[5].textContent === 'Yes',
                    restricted: row.childNodes[6].textContent === 'Restricted'
                }
                Vue.set( this.byId, id, track )
            }

            row = row.nextSibling
        }

        this.fetching = false
    }
} )
