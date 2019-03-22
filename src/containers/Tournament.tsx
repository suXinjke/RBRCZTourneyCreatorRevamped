import * as tsx from 'vue-tsx-support'
import { store } from '../store'
import { constants } from '../data/constants'
import { licenses } from '../data/licenses'

export default tsx.componentFactory.create( {
    name: 'Tournament',

    computed: {
        superally: function() {
            return constants.fetched ? constants.superally : undefined
        },

        tournament: function() {
            return store.tournament
        },

        licenses: function() {
            return licenses.options
        }
    },

    props: {
        errors: Object as () => {
            name: string,
            from_datetime: string,
            to_datetime: string,
            registration_deadline: string
        }
    },

    render: function( h ) {
        return (
            <table><tbody>
                 <tr>
                    <td><label for='tournament.name'>Tournament name</label></td>
                    <td>
                        <input id='tournament.name' v-model={ this.tournament.name }/>
                        <div class='error'>{ this.errors.name }</div>
                    </td>
                </tr>

                <tr>
                    <td><label for='tournament.description'>Tournament description</label></td>
                    <td><textarea id='tournament.description' v-model={ this.tournament.description } style='background-color: #050505;'/></td>
                </tr>

                <tr>
                    <td><label for='tournament.license_id'> License</label></td>
                    <td>
                        <select v-model={ this.tournament.license_id }>
                        { this.licenses.map( option =>
                            <option key={ `license${option.id}` } value={ option.id }>{ option.label }</option>
                        ) }
                        </select>
                    </td>
                </tr>

                <tr>
                    <td><label for='tournament.online'> Online tournament</label></td>
                    <td><input type='checkbox' id='tournament.online' v-model={ this.tournament.online }/></td>
                </tr>

                <tr>
                    <td><label for='tournament.offline'> Offline tournament</label></td>
                    <td><input type='checkbox' id='tournament.offline' v-model={ this.tournament.offline }/></td>
                </tr>

                <tr>
                    <td>Valid from (<a href='https://greenwichmeantime.com/time-zone/europe/european-union/czech-republic/'>CET</a>) (blank = now)</td>
                    <td>
                        <input type='date' id='tournament.from_date' v-model={ this.tournament.from_date }/>
                        <input type='time' id='tournament.from_time' v-model={ this.tournament.from_time }/>
                        <div class='error'>{ this.errors.from_datetime }</div>
                    </td>
                </tr>

                <tr>
                    <td>Valid to (<a href='https://greenwichmeantime.com/time-zone/europe/european-union/czech-republic/'>CET</a>)</td>
                    <td>
                        <input type='date' id='tournament.from_to' v-model={ this.tournament.to_date } />
                        <input type='time' id='tournament.from_to' v-model={ this.tournament.to_time } />
                        <div class='error'>{ this.errors.to_datetime }</div>
                    </td>
                </tr>

                <tr>
                    <td><label for='tournament.cant_resume'>Can't resume tournament</label></td>
                    <td><input type='checkbox' id='tournament.cant_resume' v-model={ this.tournament.cant_resume }/></td>
                </tr>

                <tr>
                    <td><label for='tournament.only_one_car'>Only one car</label></td>
                    <td><input type='checkbox' id='tournament.only_one_car' v-model={ this.tournament.only_one_car }/></td>
                </tr>

                <tr>
                    <td><label for='tournament.dont_show_splits'>Don't show splits</label></td>
                    <td><input type='checkbox' id='tournament.dont_show_splits' v-model={ this.tournament.dont_show_splits }/></td>
                </tr>

                <tr>
                    <td><label for='tournament.dont_show_temporary_results_in_rbr'>Don't show temporary results in RBR</label></td>
                    <td><input type='checkbox' id='tournament.dont_show_temporary_results_in_rbr' v-model={ this.tournament.dont_show_temporary_results_in_rbr }/></td>
                </tr>

                <tr>
                    <td><label for='tournament.dont_show_temporary_results_in_web'>Don't show temporary results on web</label></td>
                    <td><input type='checkbox' id='tournament.dont_show_temporary_results_in_web' v-model={ this.tournament.dont_show_temporary_results_in_web }/></td>
                </tr>

                <tr>
                    <td><label for='tournament.save_replays'>Save replays</label></td>
                    <td><input type='checkbox' id='tournament.save_replays' v-model={ this.tournament.save_replays }/></td>
                </tr>

                <tr>
                    <td><label for='tournament.require_stage_comments'>Require stage comments</label></td>
                    <td><input type='checkbox' id='tournament.require_stage_comments' v-model={ this.tournament.require_stage_comments }/></td>
                </tr>

                <tr>
                    <td><label for='tournament.test_tournament'>Testing (tournament will be deleted after 14 days)</label></td>
                    <td><input type='checkbox' id='tournament.test_tournament' v-model={ this.tournament.test_tournament } /></td>
                </tr>

                <tr>
                    <td><label for='tournament.password'>Password</label></td>
                    <td><input id='tournament.password' v-model={ this.tournament.password } placeholder='No password' /></td>
                </tr>

                <tr>
                    <td><label for='tournament.registration_deadline'>Registration deadline (hours before tournament start)</label></td>
                    <td>
                        <input id='tournament.registration_deadline' v-model={ this.tournament.registration_deadline } placeholder='No registration' />
                        <div class='error'>{ this.errors.registration_deadline }</div>
                    </td>
                </tr>

                <tr>
                    <td>Superally penalty</td>
                    <td>
                    { this.superally ?
                        <select v-model={ this.tournament.superally_penalty }>
                        { this.superally.map( option =>
                            <option key={ `superally${option.id}` } value={ option.id }>{ option.label }</option>
                        ) }
                        </select>
                    :
                        <div>Loading...</div>
                    }
                    </td>
                </tr>

            </tbody></table>
        )
    }
} )
