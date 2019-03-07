import Vue from 'vue'

export const constants = Vue.observable( {
    superally: [] as SelectOption[],
    carPhysics: [] as SelectOption[],

    fetched: false,
    fetching: false,

    fetchTournamentConstants() {
        if ( this.fetching || this.fetched ) {
            return
        }

        this.fetching = true

        return new Promise( res => {
            setTimeout( () => {
                this.superally = [
                    { id: '60', label: '60s' },
                    { id: '120', label: '120s' },
                    { id: '180', label: '180s' },
                    { id: '300', label: '300s' },
                ]

                this.carPhysics = [
                    { id: '21', label: 'Default car physics' },
                    { id: '700', label: 'NGP Physics' },
                ]

                this.fetching = false
                this.fetched = true

                res()
            }, 1000 )
        } )
    }
} )
