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
        shortcut_check: SelectOption[],

        tyres_recommended: string
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

    interface Tournament {
        name: string,
        description: string,
        online: boolean,
        offline: boolean,

        from_date: string,
        from_time: string,

        to_date: string,
        to_time: string,

        cant_resume: boolean,
        only_one_car: boolean,
        dont_show_splits: boolean,
        dont_show_temporary_results_in_rbr: boolean,
        dont_show_temporary_results_in_web: boolean,
        save_replays: boolean,
        require_stage_comments: boolean,
        test_tournament: boolean,

        password: string,
        registration_deadline: string,

        superally_penalty: number
    }

    interface TournamentPOSTOutput {
        tour_name: string,
        tour_descr: string,
        online: string | null,
        offlinet: string | null,
        PhysicsModId: string,
        tour_from_date: string,
        tour_from_time: string,
        tour_to_date: string,
        tour_to_time: string,
        cantresrace: string | null,
        onecaronly: string | null,
        nosplits: string | null,
        notempres: string | null,
        notempresweb: string | null,
        savereplays: string | null,
        getcomments: string | null,
        testrun: string | null,
        ispassword: string | null,
        tour_password: string | null,
        has_legs: string | null,
        need_enroll: string | null,
        enroll_close: string | null,
        SRallyPenaltySel: string,
        tourstages: string
    }
}
