import Vue, { VNode } from 'vue';

declare global {
    namespace JSX {
        // tslint:disable no-empty-interface
        interface Element extends VNode { }
        // tslint:disable no-empty-interface
        interface ElementClass extends Vue { }
        interface IntrinsicElements {
            [ elem: string ]: any;
        }
    }

    interface SelectedTrack {
        id: string,
        name: string,
        surface_type: string,
        surface_age: string,

        weather: string,
        weather2: string,
        weather_change_allowed: boolean,
        time_of_day: string,
        clouds: string,

        service_time_mins: number,
        setup_change_allowed: boolean,
        tyre_replacement_allowed: boolean,
        tyre_change_allowed: boolean,
        tyres: string,

        damage_change_allowed: boolean,
        damage: string,

        shortcut_check: string,

        superally: boolean,
        superally_hold: boolean,

        retry_allowed: boolean

    }

    interface TrackData {
        id: string,
        name: string,
        country: string,
        surface: string,
        distance: number,
        shakedown_allowed: boolean,
        restricted: boolean
    }

    interface Leg {
        after_stage_divider: number,

        date: string,
        time: string
    }
}
