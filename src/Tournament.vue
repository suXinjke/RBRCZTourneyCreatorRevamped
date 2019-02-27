<template>
    <table><tbody>
        <tr>
            <td><label for="tournament.name">Tournament name</label></td>
            <td>
                <input id="tournament.name" v-model="tournament.name"/>
                <div v-if="errors.name" class="error">{{ errors.name }}</div>
            </td>
        </tr>

        <tr>
            <td><label for="tournament.description">Tournament description</label></td>
            <td><textarea id="tournament.description" v-model="tournament.description"/></td>
        </tr>

        <tr>
            <td><label for="tournament.online"> Online tournament</label></td>
            <td><input type="checkbox" id="tournament.online" v-model="tournament.online"></td>
        </tr>

        <tr>
            <td><label for="tournament.offline"> Offline tournament</label></td>
            <td><input type="checkbox" id="tournament.offline" v-model="tournament.offline"></td>
        </tr>

        <tr>
            <td>Valid from</td>
            <td>
                <input type="date" id="tournament.from_date" v-model="tournament.from_date">
                <input type="time" id="tournament.from_time" v-model="tournament.from_time">
                <div v-if="errors.from_datetime" class="error">{{ errors.from_datetime }}</div>
            </td>
        </tr>

        <tr>
            <td>Valid to</td>
            <td>
                <input type="date" id="tournament.from_to" v-model="tournament.to_date">
                <input type="time" id="tournament.from_to" v-model="tournament.to_time" >
                <div v-if="errors.to_datetime" class="error">{{ errors.to_datetime }}</div>
            </td>
        </tr>

        <tr>
            <td><label for="tournament.cant_resume">Can't resume tournament</label></td>
            <td><input type="checkbox" id="tournament.cant_resume" v-model="tournament.cant_resume"></td>
        </tr>

        <tr>
            <td><label for="tournament.only_one_car">Only one car</label></td>
            <td><input type="checkbox" id="tournament.only_one_car" v-model="tournament.only_one_car"></td>
        </tr>

        <tr>
            <td><label for="tournament.dont_show_splits">Don't show splits</label></td>
            <td><input type="checkbox" id="tournament.dont_show_splits" v-model="tournament.dont_show_splits"></td>
        </tr>

        <tr>
            <td><label for="tournament.dont_show_temporary_results_in_rbr">Don't show temporary results in RBR</label></td>
            <td><input type="checkbox" id="tournament.dont_show_temporary_results_in_rbr" v-model="tournament.dont_show_temporary_results_in_rbr"></td>
        </tr>

        <tr>
            <td><label for="tournament.dont_show_temporary_results_in_web">Don't show temporary results on web</label></td>
            <td><input type="checkbox" id="tournament.dont_show_temporary_results_in_web" v-model="tournament.dont_show_temporary_results_in_web"></td>
        </tr>

        <tr>
            <td><label for="tournament.save_replays">Save replays</label></td>
            <td><input type="checkbox" id="tournament.save_replays" v-model="tournament.save_replays"></td>
        </tr>

        <tr>
            <td><label for="tournament.require_stage_comments">Require stage comments</label></td>
            <td><input type="checkbox" id="tournament.require_stage_comments" v-model="tournament.require_stage_comments"></td>
        </tr>

        <tr>
            <td><label for="tournament.test_tournament">Testing (tournament will be deleted after 14 days)</label></td>
            <td><input type="checkbox" id="tournament.test_tournament" v-model="tournament.test_tournament"></td>
        </tr>

        <tr>
            <td><label for="tournament.password">Password</label></td>
            <td><input id="tournament.password" v-model="tournament.password" placeholder="No password"></td>
        </tr>

        <tr>
            <td><label for="tournament.registration_deadline">Registration deadline (hours before tournament start)</label></td>
            <td><input id="tournament.registration_deadline" v-model="tournament.registration_deadline" placeholder="No registration"></td>
        </tr>

        <tr>
            <td>Superally penalty</td>
            <td>
                <select v-model="tournament.superally_penalty">
                    <option v-for="option in superally_penalties" v-bind:value="option.id" :key="option.id">
                        {{ option.value }}
                    </option>
                </select>
            </td>
        </tr>
    </tbody></table>
</template>

<script lang="ts">
import Vue from 'vue'
import store, { formatDate, formatTime } from './store'
import superally_penalties from './data/superally.json'

export default Vue.extend( {
    name: 'Tournament',
    data: function() {
        return {
            superally_penalties,
            tournament: store.tournament
        }
    },

    props: {
        errors: Object as () => {
            from_date: string,
            to_date: string
        }
    }
} )
</script>