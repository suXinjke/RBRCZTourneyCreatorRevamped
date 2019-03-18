export function formatDate( date: Date ) {
    return `${( '000' + date.getFullYear() ).slice( -4 )}-${( '0' + ( date.getMonth() + 1 ) ).slice( -2 )}-${( '0' + date.getDate() ).slice( -2 )}`
}

export function stringDateToCZDate( date: string ) {
    return date.split( '-' ).reverse().map( number_string => Number( number_string ).toString() ).join( '.' )
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
    page_selector?: string
} = {} ) {
    const { flow = '0', curstagepos = '0', page_selector = '0' } = next_page

    return fetch( '/index.php?act=tourmntscre4A', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: urlEncode( {
            ...data,
            flow,
            curstagepos,
            page_selector,
            submit_page_go: 'Go'
        } )
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
