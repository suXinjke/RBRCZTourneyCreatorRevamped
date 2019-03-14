import * as tsx from 'vue-tsx-support'
import { store } from '../store'
import { constants } from '../data/constants'
import { cars } from '../data/cars'

export default tsx.componentFactory.create( {
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
            return constants.fetched ? constants.carPhysics : undefined
        },

        track_physics_select: function() {
            return cars.trackPhysics[this.cars_physics.car_physics_id] || []
        },

        car_packs_select: function() {
            if ( !this.car_physics_select ) {
                return []
            }

            if ( !cars.carPacks[this.cars_physics.car_physics_id] ) {
                return []
            }

            const carPack = cars.carPacks[this.cars_physics.car_physics_id]

            return Object.keys( carPack ).map( id => ( {
                id,
                label: carPack[id].name
            } ) )
        },
        available_cars: function() {
            if ( !this.car_packs_select ) {
                return []
            }

            const carPack = cars.carPacks[this.cars_physics.car_physics_id][this.car_pack]

            return this.carIdsForSelect( carPack.cars )
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
            this.addToSelected( this.available_cars.map( car => car.id ) )
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
                value: cars.byId[car_id] as string
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
    },

    render( h ) {
        return (
            <table><tbody><tr>
                <td>
                    <div>
                        Car physics
                    { this.car_physics_select ?
                        <select style='width: 100%;' v-model={ this.cars_physics.car_physics_id }>
                            <option disabled value=''>Select car physics</option>
                        { this.car_physics_select.map( option =>
                            <option key={ option.id } value={ option.id }>{ option.label }</option>
                        ) }
                        </select>
                    :
                        <div>Loading...</div>
                    }
                    </div>

                    <div>
                        Track physics
                        <select style='width: 100%;' v-model={ this.cars_physics.track_physics_id }>
                            <option disabled value=''>{
                                cars.fetching[this.cars_physics.car_physics_id] ? 'Loading...' :
                                !this.cars_physics.car_physics_id ? 'Select car physics first' :
                                'Select track physics'
                            }</option>
                        { this.track_physics_select.map( option =>
                            <option key={ option.id } value={ option.id }>{ option.label }</option>
                        ) }
                        </select>
                    </div>

                    <div>
                        Car pack
                        <select style='width: 100%;' v-model={ this.car_pack }>
                            <option disabled value=''>{
                                cars.fetching[this.cars_physics.car_physics_id] ? 'Loading...' :
                                !this.cars_physics.car_physics_id ? 'Select car physics first' :
                                'Select car pack'
                            }</option>
                        { this.car_packs_select.map( option =>
                            <option key={ option.id } value={ option.id }>{ option.label }</option>
                        ) }
                        </select>
                    </div>

                    <div>
                        <select v-model={ this.available_cars_selected_ids } multiple style='width: 100%; min-width: 200px; height: 400px;'>
                        { this.car_pack ? this.available_cars.map( option =>
                            <option key={ option.id } title={ option.value } value={ option.id } onDblclick={ this.addSelected }>{ option.value }</option>
                        ) : (
                            <option disabled value=''>No car pack selected</option>
                        ) }
                        </select>
                    </div>
                </td>

                <td class='select-buttons'>
                    <button onClick={ this.addSelected } style='text-align: left;'>Add selected ></button>
                    <button onClick={ this.addAll } style='text-align: left;'>Add all >></button>
                    <button onClick={ this.removeSelected } style='text-align: right;'>&lt; Remove selected</button>
                    <button onClick={ this.removeAll } style='text-align: right;'>&lt;&lt; Remove all</button>
                </td>

                <td>
                    Selected cars
                    <select v-model={ this.selected_cars_selected_ids } multiple style='width: 100%; min-width: 200px; height: 500px;'>
                    { this.errors.selected_cars &&
                        <option class='error'>{ this.errors.selected_cars }</option>
                    }
                    { this.selected_cars.map( option =>
                        <option key={ option.id } value={ option.id }>{ option.value }</option>
                    ) }
                    </select>
                </td>
            </tr></tbody></table >
        )
    }
} )
