export function formatDate( date: Date ) {
    return `${( '000' + date.getFullYear() ).slice( -4 )}-${( '0' + ( date.getMonth() + 1 ) ).slice( -2 )}-${( '0' + date.getDate() ).slice( -2 )}`
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
