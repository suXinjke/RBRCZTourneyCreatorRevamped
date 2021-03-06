export function formatDate( date: Date ) {
    return `${( '000' + date.getFullYear() ).slice( -4 )}-${( '0' + ( date.getMonth() + 1 ) ).slice( -2 )}-${( '0' + date.getDate() ).slice( -2 )}`
}

export function stringDateToCZDate( date: string ) {
    return date.split( '-' ).reverse().map( number_string => Number( number_string ).toString() ).join( '.' )
}

export function czDateToStringDate( date: string ) {
    return date.split( '.' ).reverse().map( ( str, index ) => index === 0 ? str : str.padStart( 2, '0' ) ).join( '-' )
}

export function formatTime( date: Date ) {
    return `${( '0' + date.getHours() ).slice( -2 )}:${( '0' + date.getMinutes() ).slice( -2 )}`
}

export function arrayCanMoveElement( array: any[], index: number, offset: number ) {
    return (
        offset > 0 ? index + offset < array.length :
        offset < 0 ? index + offset >= 0 :
        true
    )
}

export function arrayMoveElement( array: any[], index: number, offset: number ) {
    if ( arrayCanMoveElement( array, index, offset ) === false ) {
        return false
    }

    const new_index = index + offset

    if ( new_index >= array.length ) {
        let k = new_index - array.length + 1
        while ( k-- ) {
            array.push( undefined )
        }
    }

    array.splice( new_index, 0, array.splice( index, 1 )[ 0 ] )

    return true
}

// https://stackoverflow.com/a/2450976/1293256
export function arrayShuffle( array: any[] ) {
    array = [ ...array ]
    let currentIndex = array.length
    let temporaryValue
    let randomIndex

    // While there remain elements to shuffle...
    while ( 0 !== currentIndex ) {
        // Pick a remaining element...
        randomIndex = Math.floor( Math.random() * currentIndex )
        currentIndex -= 1

        // And swap it with the current element.
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }

    return array
}

export function arrayRandom<T>( array: T[] ): T {
    const randomIndex = Math.floor( Math.random() * Math.floor( array.length ) )
    return array[randomIndex]
}

export function objectWithoutNulls<T = any>( obj: T ): Partial<T> {
    return Object.keys( obj ).reduce( ( prev, id ) => ( ( obj as any )[id] === null ? prev : {
        ...prev,
        [id]: ( obj as any )[id]
    } ), {} )
}

export function getElementByXpath( document: Document, path: string ): HTMLElement | null {
    return document.evaluate( path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue as HTMLElement
}

export function extractSelectOptions( node: HTMLElement | null ): SelectOption[] {
    const options: SelectOption[] = []
    if ( node ) {
        for ( const child_node of node.children ) {
            const id = child_node.getAttribute( 'value' )
            const label = child_node.textContent
            if ( id && label ) {
                options.push( { id, label } )
            }
        }
    }

    return options
}

export function urlEncode( obj: any ) {
    return Object.keys( obj ).map( key => {
        if ( Array.isArray( obj[key] ) ) {
            return ( obj[key] as any[] ).map( val => `${encodeURIComponent( `${key}[]` )}=${encodeURIComponent( val )}` ).join( '&' )
        } else {
            return `${encodeURIComponent( key )}=${encodeURIComponent( obj[key] )}`
        }
    } ).join( '&' )
}

export function post( data: any, next_page: {
    flow?: string,
    curstagepos?: string,
    page_selector?: string,
    save_tournament?: boolean,
    save_from_leg_page?: boolean
} = {} ) {
    const { flow = null, curstagepos = null, page_selector = null, save_tournament = false, save_from_leg_page = false } = next_page

    const save_params = save_tournament ?
        ( save_from_leg_page ? { submit_page: 'Save' } : { submit_save_tour: 'Save tour' } ) :
        { submit_page_go: 'Go' }

    return fetch( '/index.php?act=tourmntscre4A', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: urlEncode( objectWithoutNulls( {
            ...data,
            flow,
            curstagepos,
            page_selector,
            ...save_params
        } ) )
    } )
}

export function waitUntil( func: () => boolean, checkInMsecs: number = 300 ) {
    return new Promise( res => {
        const intervalFunc = () => {
            func() ? res() : setInterval( intervalFunc, checkInMsecs )
        }
        intervalFunc()
    } )
}

export function datePacks() {
    const now = new Date()
    const nextHalfAnHour = new Date( Number( now ) + 1000 * 60 * 30 )
    const nextDay = new Date( Number( now ) + 1000 * 60 * 60 * 24 * 1 )
    const nextThreeDays = new Date( Number( now ) + 1000 * 60 * 60 * 24 * 3 )

    return {
        now,
        nextHalfAnHour,
        nextDay,
        nextThreeDays
    }
}

export function cacheStore( key: string, value: string, age_secs: number ) {
    window.localStorage.setItem( key, value )

    const time_msecs = Number( new Date() )
    window.localStorage.setItem( key + '_expires', ( time_msecs + age_secs * 1000 ).toString() )
}

export function cacheGet( key: string ) {
    const item = window.localStorage.getItem( key )
    if ( !item ) {
        return null
    }

    const time_msecs = Number( new Date() )
    const expiration_date = window.localStorage.getItem( key + '_expires' )
    if ( !expiration_date || time_msecs >= Number( expiration_date ) ) {
        return null
    }

    return item
}
