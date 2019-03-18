import * as tsx from 'vue-tsx-support'
import { formatDate, formatTime, arrayCanMoveElement } from '../util'
import { store } from '../store'
import { tracks } from '../data/tracks'
import { trackSettings } from '../data/track-settings'
import TyreSelect from '../components/TyreSelect'
import WeatherSelect from '../components/WeatherSelect'
import DamageSelect from '../components/DamageSelect'
import SurfaceTypeSelect from '../components/SurfaceTypeSelect'
import SurfaceAgeSelect from '../components/SurfaceAgeSelect'
import ServiceSelect from '../components/ServiceSelect'

export default tsx.componentFactory.create( {
    name: 'Legs',
    data: function() {
        return {
            tracks_data: tracks.byId,
            tracks_settings: trackSettings.byId,

            tracks: store.tracks,
            legs: store.legs,

            store
        }
    },
    props: {
        errors: Object as () => {
            [index: string]: string
        }
    },
    computed: {
        maxStageDivider: function() {
            return this.legs.reduce( ( max, leg ) => leg.after_stage_divider > max ? leg.after_stage_divider : max, 0 )
        },

        canAddLeg: function() {
            return (
                this.tracks.length >= 2 &&
                ( this.legs.length === 0 || this.maxStageDivider < this.tracks.length - 2 )
            )
        },

        lastLeg: function() {
            return this.legs[this.legs.length - 1]
        }
    },
    methods: {
        arrayCanMoveElement,

        addLeg: function() {
            if ( this.canAddLeg === false ) {
                return
            }

            const now = new Date()
            const nextThreeHours = new Date( Number( now ) + 1000 * 60 * 60 * 3 )
            const nextSixHours = new Date( Number( now ) + 1000 * 60 * 60 * 6 )

            this.legs.push( {
                after_stage_divider: this.legs.length === 0 ? 0 : this.maxStageDivider + 1,

                date: formatDate( nextThreeHours ),
                time: formatTime( nextThreeHours )
            } )
        },

        canMoveLegUp: function( stage_split: number ) {
            return (
                stage_split > 0 &&
                this.legs.find( leg => leg.after_stage_divider === stage_split - 1 ) === undefined
            )
        },

        moveLegUp: function( stage_split: number ) {
            if ( this.canMoveLegUp( stage_split ) === false ) {
                return
            }

            for ( const leg of this.legs ) {
                if ( leg.after_stage_divider === stage_split ) {
                    leg.after_stage_divider--
                    break
                }
            }
        },

        canMoveLegDown: function( stage_split: number ) {
            return (
                stage_split < this.tracks.length - 2 &&
                this.legs.find( leg => leg.after_stage_divider === stage_split + 1 ) === undefined
            )
        },

        moveLegDown: function( stage_split: number ) {
            if ( this.canMoveLegDown( stage_split ) === false ) {
                return
            }

            for ( const leg of this.legs ) {
                if ( leg.after_stage_divider === stage_split ) {
                    leg.after_stage_divider++
                    break
                }
            }
        },

        removeLeg: function( stage_split: number ) {
            for ( let i = 0 ; i < this.legs.length ; i++ ) {
                if ( this.legs[i].after_stage_divider === stage_split ) {
                    this.legs.splice( i, 1 )
                    break
                }
            }
        }
    },

    render: function( h ) {
        return (
            <div>
                <table>
                    <tbody>
                    { this.tracks.map( ( track, index ) => ( [ (
                        <tr key={ index }>
                            <td style='vertical-align: top; min-width: 40px;'>
                                SS { index + 1 }
                            </td>
                            <td class='schedule-legs-inputs' style='vertical-align: top;'>
                                <div>
                                    <input v-model={ track.name } placeholder={ this.tracks_data[track.id].name }/>
                                    <WeatherSelect track={ track }/>
                                    <DamageSelect track={ track }/>
                                </div>
                                <div>
                                    <TyreSelect track={ track }/>
                                    <SurfaceTypeSelect track={ track }/>
                                    <SurfaceAgeSelect track={ track }/>
                                    <ServiceSelect track={ track }/>
                                </div>
                                <div>
                                    <input id={`tcbox${index}`}  type='checkbox' v-model={ track.tyre_change_allowed }/>    <label for={`tcbox${index}`} >Tyre change</label>
                                    <input id={`scbox${index}`}  type='checkbox' v-model={ track.setup_change_allowed }/>   <label for={`scbox${index}`} >Setup change</label>
                                    <input id={`srbox${index}`}  type='checkbox' v-model={ track.superally }/>              <label for={`srbox${index}`} >Superally</label>
                                    <input id={`srhbox${index}`} type='checkbox' v-model={ track.superally_hold }/>         <label for={`srhbox${index}`}>Superally hold</label>
                                </div>
                            </td>
                            <td style='width: 50px;'>
                                <button
                                    title='Move track up'
                                    style='width: 100%;'
                                    disabled={ this.arrayCanMoveElement( this.tracks, index, -1 ) === false }
                                    onClick={ () => store.trackMoveUp( index ) }
                                >
                                    ^
                                </button>
                                <button
                                    title='Move track down'
                                    style='width: 100%;'
                                    disabled={ arrayCanMoveElement( this.tracks, index, +1 ) === false }
                                    onClick={ () => store.trackMoveDown( index ) }
                                >
                                    v
                                </button>
                                <button title='Remove track' style='width: 100%;' onClick={ () => store.trackRemove( index ) }>X</button>
                            </td>
                        </tr> ),
                    track.service_time_mins > 0 && (
                        <tr>
                            <th colspan={ 3 }>Service area ({ track.service_time_mins } min.) / <input type='checkbox' v-model={ track.tyre_replacement_allowed }/> Tyre replacement</th>
                        </tr>
                    ),
                    track.superally_hold && (
                        <tr>
                            <th colspan={ 3 }>Superally</th>
                        </tr>
                    ),
                    this.legs.map( ( leg, leg_index ) => index !== leg.after_stage_divider ? null : (
                        <tr key={ `${index} ${leg}leg` }>
                            <th colspan={ 3 } style='text-align: center' class='leg_revamped'>
                                <button
                                    title='Move leg up'
                                    onClick={ () => this.moveLegUp( leg.after_stage_divider ) }
                                    disabled={ this.canMoveLegUp( leg.after_stage_divider ) === false }
                                >
                                    ^^^
                                </button>
                                Leg { leg_index + 1 }
                                <input type='date' v-model={ leg.date }/>
                                <input type='time' v-model={ leg.time }/>
                                <button title='Remove leg' onClick={ () => this.removeLeg( leg.after_stage_divider ) }>Remove</button>
                                Leg { leg_index + 2 }
                                <button
                                    title='Move leg down'
                                    onClick={ () => this.moveLegDown( leg.after_stage_divider ) }
                                    disabled={ this.canMoveLegDown( leg.after_stage_divider ) === false }
                                >
                                    vvv
                                </button>
                                <div>{ this.errors[leg.after_stage_divider] }</div>
                            </th>
                        </tr>
                    ) )
                    ] ) ) }
                    </tbody>
                </table>

                <table style='margin: 0 auto;'>
                    <thead><tr>
                        <td>Leg</td>
                        <td>Stage</td>
                        <td>Date from</td>
                        <td>Date to</td>
                    </tr></thead>
                { this.legs.length > 0 &&
                    <tbody>
                    { this.legs.map( ( leg, leg_index ) => (
                        <tr key={ `${leg_index} leg`}>
                            <td>{ leg_index + 1 }</td>

                        { leg_index === 0 ?
                            <td>1 - { leg.after_stage_divider + 1 }</td>
                        : leg_index === this.legs.length - 1 ?
                            <td>{ this.legs[leg_index - 1].after_stage_divider + 2 } - { leg.after_stage_divider + 1 }</td>
                        :   <td>{ this.legs[leg_index - 1].after_stage_divider + 2 } - { leg.after_stage_divider + 1 }</td>
                        }

                        { leg_index === 0 ?
                            <td>{ store.tournament.from_date } { store.tournament.from_time }</td>
                        :   <td>{ this.legs[leg_index - 1].date } { this.legs[leg_index - 1].time }</td>
                        }

                            <td>{ leg.date } { leg.time }</td>
                        </tr>
                    ) ) }
                        <tr>
                            <td>{ this.legs.length + 1 }</td>

                            <td>{ this.lastLeg.after_stage_divider + 2 } - { this.store.tracks.length }</td>

                            <td>{ this.lastLeg.date } { this.lastLeg.time }</td>

                            <td>{ store.tournament.to_date } { store.tournament.to_time }</td>
                        </tr>
                    </tbody>
                }
                { this.legs.length === 0 &&
                    <tbody style='text-align: center;'>
                        <td colspan={ 4 }>No legs created</td>
                    </tbody>
                }
                    <tfoot><tr><td colspan={ 4 } style='text-align: center;'>
                        <button onClick={ this.addLeg } disabled={ this.canAddLeg === false }>Add leg</button>
                    </td></tr></tfoot>
                </table>
            </div>
        )
    }
} )
