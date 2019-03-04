import * as tsx from 'vue-tsx-support'
import { store } from '../store'

export default tsx.componentFactory.create( {
    name: 'Presets',

    data: function() {
        return {
            store,

            saveNames: ( new Array( 10 ) ).fill( undefined )
        }
    },

    methods: {
        save: function( slot: number, name: string | null ) {
            if ( !name || !name.trim() ) {
                return
            }
            this.saveNames = this.saveNames.map( ( value, index ) => index !== slot ? value : name )
            localStorage.setItem( `save${slot}`, JSON.stringify( this.store ) )
        },
        load: function( slot: number ) {
            const data: any = localStorage.getItem( `save${slot}` )
            if ( !data ) {
                return
            }

            Object.assign( this.store, JSON.parse( data ) )
        },
    },

    mounted: function() {
        const items = localStorage.getItem( 'save_names' )
        if ( items ) {
            this.saveNames = JSON.parse( items )
        }
    },

    watch: {
        saveNames: function() {
            localStorage.setItem( 'save_names', JSON.stringify( this.saveNames ) )
        }
    },

    computed: {
        output: function() {
            return {
                tournament: {
                    flow: '0',
                    curstagepos: '0',
                    page_selector: '1',
                    submit_page_go: 'Go',
                    tour_name: this.store.tournament.name,
                    tour_descr: this.store.tournament.description,
                    online: this.store.tournament.online ? 'on' : '',
                    offlinet: this.store.tournament.offline ? 'on' : '',
                    PhysicsModId: this.store.cars_physics.car_physics_id,
                    tour_from_date: this.store.tournament.from_date.split( '-' ).reverse().map( number_string => Number( number_string ).toString() ).join( '.' ),
                    tour_from_time: this.store.tournament.from_time,
                    tour_to_date: this.store.tournament.to_date.split( '-' ).reverse().map( number_string => Number( number_string ).toString() ).join( '.' ),
                    tour_to_time: this.store.tournament.to_time,
                    cantresrace: this.store.tournament.cant_resume ? 'on' : '',
                    onecaronly: this.store.tournament.only_one_car ? 'on' : '',
                    nosplits: this.store.tournament.dont_show_splits ? 'on' : '',
                    notempres: this.store.tournament.dont_show_temporary_results_in_rbr ? 'on' : '',
                    notempresweb: this.store.tournament.dont_show_temporary_results_in_web ? 'on' : '',
                    savereplays: this.store.tournament.save_replays ? 'on' : '',
                    getcomments: this.store.tournament.require_stage_comments ? 'on' : '',
                    testrun: this.store.tournament.test_tournament ? 'on' : '',
                    ispassword: this.store.tournament.password ? 'on' : '',
                    tour_password: this.store.tournament.password,
                    has_legs: this.store.legs.length > 0 ? 'on' : '',
                    need_enroll: this.store.tournament.registration_deadline ? 'on' : '',
                    enroll_close: this.store.tournament.registration_deadline,
                    SRallyPenaltySel: this.store.tournament.superally_penalty.toString(),
                    tourstages: this.store.tracks.map( track => track.id ).join( ',' ) + ','
                },

                cars_physics: {
                    flow: '1',
                    curstagepos: '0',
                    page_selector: '2',
                    submit_page_go: 'Go',
                    LicSel: [ '0' ], // TODO: License selection
                    ModsSel: [ this.store.cars_physics.track_physics_id, ...this.store.cars_physics.selected_car_ids ]
                },

                // TODO: account for last page
                tracks: this.store.tracks.map( ( track, index, tracks ) => ( {
                    flow: '2',
                    curstagepos: ( index + 1 ).toString(),
                    page_selector: '2',
                    submit_page_go: 'Go',
                    renamestage: track.name ? 'on' : '',
                    stage_rename: track.name,
                    CarSel: this.store.cars_physics.selected_car_ids[0],
                    SurfSel: track.surface_type, // TODO: needs proper ID
                    SurfAgeSel: track.surface_age, // TODO: needs proper ID
                    TexturesPackSel: '-1',
                    WeatherPackSel: '-1',
                    canchangeweather: track.weather_change_allowed ? 'on' : '',
                    WeatherSel: track.weather, // TODO: needs proper ID
                    TimeOfDaySel: track.time_of_day, // TODO: needs proper ID
                    Weather2Sel: track.weather2, // TODO: needs proper ID
                    CloudsSel: track.clouds, // TODO: needs proper ID
                    ServiceSel: track.service_time_mins.toString(),
                    canrenewtyres: track.tyre_replacement_allowed ? 'on' : '',
                    canchangetyres: track.tyre_change_allowed ? 'on' : '',
                    TyresSel: track.tyres, // TODO: needs proper ID
                    canchangedamage: track.damage_change_allowed ? 'on' : '',
                    DamageSel: track.damage, // TODO: needs proper ID
                    CutcheckerSel: track.shortcut_check, // TODO: needs proper ID
                    leg_pos: 'TODO', // TODO: calculate the leg position
                    allowsuperally: track.superally ? 'on' : '',
                    superallychpoint: track.superally_hold ? 'on' : '',
                    canrepeatstage: track.retry_allowed ? 'on' : '',
                    canchangesetup: track.setup_change_allowed ? 'on' : ''
                } ) ),

                legs: [ 'TODO' ]
            }
        }
    },

    render: function( h ) {
        return (
            <div>
                <div>{ 'Save slot: ' }
                { ( new Array( 10 ) ).fill( 0 ).map( ( nothing, index ) =>
                    <button onClick={ () => this.save( index, prompt( 'Enter the slot save name' ) ) }>{ index + 1 }</button>
                ) }
                </div>
                <div>{ 'Load slot: ' }
                { ( this.saveNames.map( ( saveName, index ) =>
                    <button disabled={ Boolean( saveName ) === false }>{ index + 1 } { saveName ? `- ${saveName}` : '' }</button>
                ) ) }
                </div>
                <table>
                    <thead>
                        <tr>
                            <td>JSON Data</td>
                            <td>Output data</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style='vertical-align: top;'><pre>{ JSON.stringify( this.store, null, 4 ).trim() }</pre></td>
                            <td style='vertical-align: top;'><pre>{ JSON.stringify( this.output, null, 4 ).trim() }</pre></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
} )
