import * as tsx from 'vue-tsx-support'
import { store } from '../store'
import cars_data from '../data/cars.json'
import car_packs_data from '../data/car-packs.json'

interface Physics {
    [index: string]: {
        name: string,
        track_physics: {
            [index: string]: string
        },
        car_packs: string[]
    }
}

const physics: Physics = {
    1: {
        name: 'Default car physics',
        track_physics: {
            21: 'Base physic',
            47: 'Snow mod + Snow France',
            48: 'Snow France',
            49: 'Snow mod'
        },
        car_packs: [
            '500',
            '501',
            '502',
            '503',
            '504',
            '505',
            '506',
            '510',
            '512',
            '513',
            '515',
            '516',
            '518',
            '519'
        ]
    },
    2: {
        name: 'NPG physics',
        track_physics: {
            2404: 'NGP Physics 4.4',
            2405: 'NGP Physics 5.0.1'
        },
        car_packs: [
            '520',
            '521',
            '522',
            '523',
            '524',
            '525',
            '526',
            '527',
            '528',
            '529',
            '530',
            '531',
            '532',
            '533',
            '550',
            '551'
        ]
    }
}

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
    },

    render( h ) {
        return (
            <table><tbody><tr>
                <td>
                    <div>
                        Car physics
                        <select v-model={ this.cars_physics.car_physics_id }>
                            <option disabled value=''>Select car physics</option>
                        { this.car_physics_select.map( option =>
                            <option key={ option.id } value={ option.id }>{ option.value }</option>
                        ) }
                        </select>
                    </div>

                    <div>
                        Track physics
                        <select v-model={ this.cars_physics.track_physics_id }>
                            <option disabled value=''>Select track physics</option>
                        { this.track_physics_select.map( option =>
                            <option key={ option.id } value={ option.id }>{ option.value }</option>
                        ) }
                        </select>
                    </div>

                    <div>
                        Car pack
                        <select v-model={ this.car_pack }>
                            <option disabled value=''>Select car pack</option>
                        { this.car_packs_select.map( option =>
                            <option key={ option.id } value={ option.id }>{ option.value }</option>
                        ) }
                        </select>
                    </div>

                    <div>
                        <select v-model={ this.available_cars_selected_ids } multiple style='min-width: 200px; height: 400px;'>
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
                    <select v-model={ this.selected_cars_selected_ids } multiple style='min-width: 200px; height: 500px;'>
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
