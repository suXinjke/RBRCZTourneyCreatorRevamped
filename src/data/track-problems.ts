enum SurfaceType {
    Dry = '0',
    Damp = '1',
    Wet = '2',
}

enum SurfaceAge {
    New = '0',
    Normal = '1',
    Worn = '2',
}

export const problems: { [index: string]: TrackProblems } = {

    // RSI slalom Shonen
    139: {
        surface_type: [ SurfaceType.Damp, SurfaceType.Wet ],
    },

    // RSI slalom gegeWRC
    140: {
        surface_type: [ SurfaceType.Damp, SurfaceType.Wet ]
    },

    // Jirkovicky
    488: {
        surface_type: [ SurfaceType.Damp ]
    },

    // Swiss II
    585: {
        surface_age: [ SurfaceAge.Normal, SurfaceAge.Worn ]
    },

    // Blanare
    590: {
        surface_type: [ SurfaceType.Damp, SurfaceType.Wet ],
    },

    // Blanare II
    591: {
        surface_type: [ SurfaceType.Damp, SurfaceType.Wet ]
    },

    // Pikes Peak 2008
    598: {
        surface_type: [ SurfaceType.Damp, SurfaceType.Wet ]
    },

    // Sturec
    607: {
        surface_type: [ SurfaceType.Damp, SurfaceType.Wet ]
    },

    // Sturec II
    608: {
        surface_type: [ SurfaceType.Damp, SurfaceType.Wet ]
    },

    // Lousada - WRC
    703: {
        surface_age: [ SurfaceAge.Normal, SurfaceAge.Worn ]
    },

    // Lousada - RG
    705: {
        surface_age: [ SurfaceAge.Normal, SurfaceAge.Worn ]
    },

    // Ai-Petri Winter
    802: {
        surface_age: [ SurfaceAge.Normal, SurfaceAge.Worn ]
    },

    // Uchan-Su Winter
    803: {
        surface_age: [ SurfaceAge.Normal, SurfaceAge.Worn ]
    },

    // Azov
    830: {
        surface_age: [ SurfaceAge.Normal, SurfaceAge.Worn ]
    },

    // Puy du Lac
    1012: {
        time_of_day: [ '3' ]
    },
}
