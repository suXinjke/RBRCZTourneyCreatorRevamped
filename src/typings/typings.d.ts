import Vue, { VNode } from 'vue'
import 'vue-tsx-support/options/allow-element-unknown-attrs'

declare global {

    interface SelectOption {
        id: string,
        label: string
    }

    interface TrackSettings {
        surface_type: SelectOption[],
        surface_age: SelectOption[],
        weather: SelectOption[],
        weather2: SelectOption[],
        clouds: SelectOption[],
        time_of_day: SelectOption[],
        tyres: SelectOption[],
        damage: SelectOption[],
        shortcut_check: SelectOption[]
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

    interface TrackWeatherData {
        time_of_day: SelectOption,
        weather2: SelectOption,
        clouds: SelectOption,
        remark: string
    }

    interface Leg {
        after_stage_divider: number,

        date: string,
        time: string
    }
}
