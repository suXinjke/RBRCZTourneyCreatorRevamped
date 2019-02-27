<template>
    <table><tbody><tr>
        <td>
            <div>
                Car physics
                <select v-model="cars_physics.car_physics_id">
                    <option disabled value="">Select car physics</option>
                    <option v-for="option in car_physics_select" v-bind:value="option.id" :key="option.id">
                        {{ option.value }}
                    </option>
                </select>
            </div>

            <div>
                Track physics
                <select v-model="cars_physics.track_physics_id">
                    <option disabled value="">Select track physics</option>
                    <option v-for="option in track_physics_select" v-bind:value="option.id" :key="option.id">
                        {{ option.value }}
                    </option>
                </select>
            </div>

            <div>
                Car pack
                <select v-model="car_pack">
                    <option disabled value="">Select car pack</option>
                    <option
                        v-for="option in car_packs_select"
                        v-bind:value="option.id" :key="option.id"
                    >
                        {{ option.value }}
                    </option>
                </select>
            </div>

            <div>
                <select v-model="available_cars_selected_ids" multiple style="min-width: 200px; height: 400px;">
                    <option disabled value="" v-if="!car_pack">No car pack selected</option>
                    <option
                        v-for="option in available_cars" v-bind:value="option.id" :key="option.id"
                        :title="option.value" v-on:dblclick="addSelected"
                    >
                        {{ option.value }}
                    </option>
                </select>
            </div>
        </td>

        <td class="select-buttons">
            <button v-on:click="addSelected" style="text-align: left;">Add selected ></button>
            <button v-on:click="addAll" style="text-align: left;">Add all >></button>
            <button v-on:click="removeSelected" style="text-align: right;">&lt; Remove selected</button>
            <button v-on:click="removeAll" style="text-align: right;">&lt;&lt; Remove all</button>
        </td>

        <td>
            Selected cars
            <select v-model="selected_cars_selected_ids" multiple style="min-width: 200px; height: 500px;">
                <option
                    v-for="option in selected_cars" v-bind:value="option.id" :key="option.id"
                    :title="option.value" v-on:dblclick="removeSelected"
                >
                    {{ option.value }}
                </option>
            </select>
            <div v-if="errors.selected_cars" class="error">{{ errors.selected_cars }}</div>
        </td>
    </tr></tbody></table>
</template>

<script lang="ts">
import Vue from 'vue'
import store from './store'
import cars_data from './data/cars.json'
import car_packs_data from './data/car-packs.json'
import physics from './data/physics.json'

export default Vue.extend( {
    name: 'Cars',

    data: function() {
        return {

            car_pack: '',
            available_cars_selected_ids: [] as string[],

            selected_cars_selected_ids: [] as string[],

            cars_physics: store.cars_physics
        }
    },

    props: {
        errors: Object as () => {
            selected_cars: string,
            car_physics: string,
            track_physics: string
        }
    },

    computed: {
        car_physics_select: function() {
            return Object.keys( physics ).map( key => ( {
                id: key,
                value: physics[key].name
            } ) )
        },

        track_physics_select: function() {
            const car_physics_id = this.cars_physics.car_physics_id
            if ( !car_physics_id ) {
                return []
            }

            return Object.keys( physics[car_physics_id].track_physics ).map( key => ( {
                id: key,
                value: physics[car_physics_id].track_physics[key]
            } ) )
        },

        car_packs_select: function() {
            const car_physics_id = this.cars_physics.car_physics_id
            if ( !car_physics_id ) {
                return []
            }

            return physics[car_physics_id].car_packs.map( ( key: string ) => ( {
                id: key,
                value: car_packs_data[key].name
            } ) )
        },
        available_cars: function() {
            if ( !this.car_pack ) {
                return []
            }

            return this.carIdsForSelect( car_packs_data[this.car_pack].cars )
        },
        selected_cars: function() {
            return this.carIdsForSelect( this.cars_physics.selected_car_ids )
        }
    },

    methods: {
        addToSelected: function( car_ids: string[] ) {
            this.cars_physics.selected_car_ids = this.cars_physics.selected_car_ids
                .concat( car_ids )
                .filter( ( car_id, index, array ) => array.indexOf( car_id ) === index )
            this.available_cars_selected_ids = []
        },

        addSelected: function() {
            this.addToSelected( this.available_cars_selected_ids )
        },

        addAll: function() {
            this.addToSelected( car_packs_data[this.car_pack].cars )
        },

        removeSelected: function() {
            this.cars_physics.selected_car_ids = this.cars_physics.selected_car_ids.filter( car_id => !this.selected_cars_selected_ids.includes( car_id ) )
        },

        removeAll: function() {
            this.cars_physics.selected_car_ids = []
            this.selected_cars_selected_ids = []
        },

        carIdsForSelect: function( car_ids: string[] ) {
            return car_ids.map( car_id => ( {
                id: car_id,
                value: cars_data[car_id] as string
            } ) ).sort( ( a, b ) => a.value.toLowerCase() > b.value.toLowerCase() ? 1 : -1 )
        }
    },

    watch: {
        'cars_physics.car_physics_id': function() {
            this.cars_physics.track_physics_id = ''
            this.cars_physics.selected_car_ids = []
            this.car_pack = ''
            this.removeAll()
        }
    }
} )
</script>