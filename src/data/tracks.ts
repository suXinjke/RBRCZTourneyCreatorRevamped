import Vue from 'vue'
import { getElementByXpath, cacheGet, cacheStore, extractSelectOptions } from '../util'

export const tracks = Vue.observable( {
    cacheChecked: false,

    byId: {} as { [index: string]: TrackData },

    fetching: false,

    async fetchTracks() {
        if ( !this.cacheChecked ) {
            const cachedTracks = cacheGet( 'tracks' )
            if ( cachedTracks ) {
                const { byId } = JSON.parse( cachedTracks )
                Vue.set( this, 'byId', byId )
            }

            this.cacheChecked = true
        }

        if ( this.fetching || Object.keys( this.byId ).length > 0 ) {
            return
        }

        this.fetching = true

        const stage_select_node = getElementByXpath( document, '//*[@id="StagesSel"]' )
        const allowed_stage_ids = extractSelectOptions( stage_select_node ).map( option => option.id ).filter( id => id.length > 0 )

        const res = await fetch( '/index.php?act=rbrtracks' )

        const text = await res.text()
        const doc = new DOMParser().parseFromString( text, 'text/html' )

        const track_rows = getElementByXpath( doc, '/html/body/table/tbody/tr/td/table[3]/tbody/tr[1]/td[2]/table/tbody/tr[2]' )

        let row: Node | null = track_rows
        while ( row ) {
            const id = row.childNodes[0].textContent
            if ( id && allowed_stage_ids.includes( id ) ) {
                const track: TrackData = {
                    id,
                    name: row.childNodes[1].textContent || '',
                    country: row.childNodes[2].textContent || '',
                    surface: row.childNodes[3].textContent || '',
                    distance: row.childNodes[4].textContent ? Number( row.childNodes[4].textContent.replace( ' km', '' ) ) : 0,
                    shakedown_allowed: [ 'ano', 'yes' ].includes( ( row.childNodes[5].textContent || '' ).toLowerCase().trim() ),
                    restricted: Boolean( ( row.childNodes[6].textContent || '' ).trim() )
                }
                Vue.set( this.byId, id, track )
            }

            row = row.nextSibling
        }

        cacheStore( 'tracks', JSON.stringify( { byId: this.byId } ), 60 * 60 * 24 )

        this.fetching = false
    }
} )
