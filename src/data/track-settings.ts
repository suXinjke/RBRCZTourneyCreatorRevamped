import Vue from 'vue'

export const trackSettings = Vue.observable( {
    byId: {} as { [index: string]: TrackSettings },

    fetching: {} as { [index: string]: boolean },

    // TODO: Fetch from CZ selected track page
    fetchTrackSettings( track_id: string, track_index: number ) {
        if ( this.fetching[track_id] || this.byId[track_id] ) {
            return
        }

        this.fetching[track_id] = true

        return new Promise( res => {
            setTimeout( () => {
                const settings: TrackSettings = {
                    surface_type: [
                        { id: '0', label: 'Dry' },
                        { id: '1', label: 'Damp' },
                        { id: '2', label: 'Wet' },
                    ],
                    surface_age: [
                        { id: '0', label: 'New' },
                        { id: '1', label: 'Normal' },
                        { id: '2', label: 'Worn' },
                    ],
                    weather: [
                        { id: '0', label: 'Good weather' },
                        { id: '1', label: 'Bad weather' },
                        { id: '2', label: 'Random weather' },
                    ],
                    weather2: [
                        { id: '0', label: 'Crisp' },
                        { id: '1', label: 'Hazy' },
                        { id: '2', label: 'No rain' },
                        { id: '3', label: 'Light rain' },
                        { id: '4', label: 'Heavy rain' },
                        { id: '5', label: 'No snow' },
                        { id: '6', label: 'Light snow' },
                        { id: '7', label: 'Heavy snow' },
                        { id: '8', label: 'Light fog' },
                        { id: '9', label: 'Heavy fog' },
                    ],
                    clouds: [
                        { id: '0', label: 'Clear' },
                        { id: '1', label: 'Partially cloudy' },
                        { id: '2', label: 'Light clouds' },
                        { id: '3', label: 'Heavy clouds' },
                    ],
                    time_of_day: [
                        { id: '0', label: 'Morning' },
                        { id: '1', label: 'Evening' },
                        { id: '2', label: 'Early evening' },
                    ],
                    tyres: [
                        { id: '0', label: 'Dry tarmac' },
                        { id: '1', label: 'Intermediate tarmac' },
                        { id: '2', label: 'Wet tarmac' },
                        { id: '3', label: 'Dry gravel' },
                        { id: '4', label: 'Intermediate gravel' },
                        { id: '5', label: 'Wet gravel' },
                        { id: '6', label: 'Snow' },
                    ],
                    damage: [
                        { id: '0', label: 'Off' },
                        { id: '1', label: 'Safe' },
                        { id: '2', label: 'Reduced' },
                        { id: '3', label: 'Realistic' },
                    ],
                    shortcut_check: [
                        { id: '0', label: 'None' },
                        { id: '1', label: 'Low' },
                    ]
                }

                Vue.set( this.byId, track_id, settings )

                this.fetching[track_id] = false

                res()
            }, 1000 )
        } )
    }
} )
