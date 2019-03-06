import Vue from 'vue'

export const tracks = Vue.observable( {
    byId: {} as { [index: string]: TrackData },

    fetching: false,

    // TODO: Fetch from CZ page and parse the track list
    async fetchTracks() {
        if ( this.fetching || Object.keys( this.byId ).length > 0 ) {
            return
        }

        this.fetching = true
        return new Promise( res => {
            setTimeout( () => {
                Object.values( legacyTracks ).forEach( legacyTrack => Vue.set( this.byId, legacyTrack.id, legacyTrack ) )

                this.fetching = false

                res()
            }, 2000 )
        } )
    }
} )

const legacyTracks = {
    10: {
        id: '10',
        name: 'Kaihuavaara',
        country: 'Finland',
        surface: 'Snow',
        distance: 6.1,
        shakedown_allowed: false,
        restricted: false
    },
    11: {
        id: '11',
        name: 'Mustaselka',
        country: 'Finland',
        surface: 'Snow',
        distance: 7.9,
        shakedown_allowed: false,
        restricted: false
    },
    12: {
        id: '12',
        name: 'Sikakama',
        country: 'Finland',
        surface: 'Snow',
        distance: 10.2,
        shakedown_allowed: false,
        restricted: false
    },
    13: {
        id: '13',
        name: 'Autiovaara',
        country: 'Finland',
        surface: 'Snow',
        distance: 6.1,
        shakedown_allowed: false,
        restricted: false
    },
    14: {
        id: '14',
        name: 'Kaihuavaara II',
        country: 'Finland',
        surface: 'Snow',
        distance: 6.1,
        shakedown_allowed: false,
        restricted: false
    },
    15: {
        id: '15',
        name: 'Mustaselka II',
        country: 'Finland',
        surface: 'Snow',
        distance: 7.7,
        shakedown_allowed: false,
        restricted: false
    },
    16: {
        id: '16',
        name: 'Sikakama II',
        country: 'Finland',
        surface: 'Snow',
        distance: 10.2,
        shakedown_allowed: false,
        restricted: false
    },
    17: {
        id: '17',
        name: 'Autiovaara II',
        country: 'Finland',
        surface: 'Snow',
        distance: 6.1,
        shakedown_allowed: false,
        restricted: false
    },
    20: {
        id: '20',
        name: 'Harwood Forest',
        country: 'Great Britain',
        surface: 'Gravel',
        distance: 6.1,
        shakedown_allowed: false,
        restricted: false
    },
    21: {
        id: '21',
        name: 'Falstone',
        country: 'Great Britain',
        surface: 'Gravel',
        distance: 6.6,
        shakedown_allowed: false,
        restricted: false
    },
    22: {
        id: '22',
        name: 'Chirdonhead',
        country: 'Great Britain',
        surface: 'Gravel',
        distance: 7,
        shakedown_allowed: false,
        restricted: false
    },
    23: {
        id: '23',
        name: 'Shepherds Shield',
        country: 'Great Britain',
        surface: 'Gravel',
        distance: 4.8,
        shakedown_allowed: false,
        restricted: false
    },
    24: {
        id: '24',
        name: 'Harwood Forest II',
        country: 'Great Britain',
        surface: 'Gravel',
        distance: 5.9,
        shakedown_allowed: false,
        restricted: false
    },
    25: {
        id: '25',
        name: 'Chirdonhead II',
        country: 'Great Britain',
        surface: 'Gravel',
        distance: 6.9,
        shakedown_allowed: false,
        restricted: false
    },
    26: {
        id: '26',
        name: 'Falstone II',
        country: 'Great Britain',
        surface: 'Gravel',
        distance: 6.6,
        shakedown_allowed: false,
        restricted: false
    },
    27: {
        id: '27',
        name: 'Shepherds Shield II',
        country: 'Great Britain',
        surface: 'Gravel',
        distance: 4.9,
        shakedown_allowed: false,
        restricted: false
    },
    30: {
        id: '30',
        name: 'Greenhills II',
        country: 'Australia',
        surface: 'Gravel',
        distance: 6,
        shakedown_allowed: false,
        restricted: false
    },
    31: {
        id: '31',
        name: 'New Bobs',
        country: 'Australia',
        surface: 'Gravel',
        distance: 10.1,
        shakedown_allowed: false,
        restricted: false
    },
    32: {
        id: '32',
        name: 'Greenhills',
        country: 'Australia',
        surface: 'Gravel',
        distance: 6,
        shakedown_allowed: false,
        restricted: false
    },
    33: {
        id: '33',
        name: 'Mineshaft',
        country: 'Australia',
        surface: 'Gravel',
        distance: 8.2,
        shakedown_allowed: false,
        restricted: false
    },
    34: {
        id: '34',
        name: 'East-West',
        country: 'Australia',
        surface: 'Gravel',
        distance: 9.5,
        shakedown_allowed: false,
        restricted: false
    },
    35: {
        id: '35',
        name: 'New Bobs II',
        country: 'Australia',
        surface: 'Gravel',
        distance: 10,
        shakedown_allowed: false,
        restricted: false
    },
    36: {
        id: '36',
        name: 'East-West II',
        country: 'Australia',
        surface: 'Gravel',
        distance: 9.6,
        shakedown_allowed: false,
        restricted: false
    },
    37: {
        id: '37',
        name: 'Mineshaft II',
        country: 'Australia',
        surface: 'Gravel',
        distance: 8.2,
        shakedown_allowed: false,
        restricted: false
    },
    41: {
        id: '41',
        name: 'Cote D\'Arbroz',
        country: 'France',
        surface: 'Tarmac',
        distance: 4.5,
        shakedown_allowed: false,
        restricted: false
    },
    42: {
        id: '42',
        name: 'Joux Verte',
        country: 'France',
        surface: 'Tarmac',
        distance: 7.9,
        shakedown_allowed: false,
        restricted: false
    },
    43: {
        id: '43',
        name: 'Bisanne',
        country: 'France',
        surface: 'Tarmac',
        distance: 5.6,
        shakedown_allowed: false,
        restricted: false
    },
    44: {
        id: '44',
        name: 'Joux Plane',
        country: 'France',
        surface: 'Tarmac',
        distance: 11.1,
        shakedown_allowed: false,
        restricted: false
    },
    45: {
        id: '45',
        name: 'Joux Verte II',
        country: 'France',
        surface: 'Tarmac',
        distance: 7.8,
        shakedown_allowed: false,
        restricted: false
    },
    46: {
        id: '46',
        name: 'Cote D\'Arbroz II',
        country: 'France',
        surface: 'Tarmac',
        distance: 4.3,
        shakedown_allowed: false,
        restricted: false
    },
    47: {
        id: '47',
        name: 'Bisanne II',
        country: 'France',
        surface: 'Tarmac',
        distance: 5.6,
        shakedown_allowed: false,
        restricted: false
    },
    48: {
        id: '48',
        name: 'Joux Plane II',
        country: 'France',
        surface: 'Tarmac',
        distance: 11.1,
        shakedown_allowed: false,
        restricted: false
    },
    50: {
        id: '50',
        name: 'Sipirkakim II',
        country: 'Japan',
        surface: 'Gravel',
        distance: 8.7,
        shakedown_allowed: false,
        restricted: false
    },
    51: {
        id: '51',
        name: 'Noiker',
        country: 'Japan',
        surface: 'Gravel',
        distance: 13.8,
        shakedown_allowed: false,
        restricted: false
    },
    52: {
        id: '52',
        name: 'Sipirkakim',
        country: 'Japan',
        surface: 'Gravel',
        distance: 8.7,
        shakedown_allowed: false,
        restricted: false
    },
    53: {
        id: '53',
        name: 'Pirka Menoko',
        country: 'Japan',
        surface: 'Gravel',
        distance: 6.7,
        shakedown_allowed: false,
        restricted: false
    },
    54: {
        id: '54',
        name: 'Tanner',
        country: 'Japan',
        surface: 'Gravel',
        distance: 3.9,
        shakedown_allowed: false,
        restricted: false
    },
    55: {
        id: '55',
        name: 'Noiker II',
        country: 'Japan',
        surface: 'Gravel',
        distance: 13.7,
        shakedown_allowed: false,
        restricted: false
    },
    56: {
        id: '56',
        name: 'Tanner II',
        country: 'Japan',
        surface: 'Gravel',
        distance: 4,
        shakedown_allowed: false,
        restricted: false
    },
    57: {
        id: '57',
        name: 'Pirka Menoko II',
        country: 'Japan',
        surface: 'Gravel',
        distance: 6.7,
        shakedown_allowed: false,
        restricted: false
    },
    60: {
        id: '60',
        name: 'Frazier Wells II',
        country: 'USA',
        surface: 'Gravel',
        distance: 5,
        shakedown_allowed: false,
        restricted: false
    },
    61: {
        id: '61',
        name: 'Fraizer Wells',
        country: 'USA',
        surface: 'Gravel',
        distance: 5,
        shakedown_allowed: false,
        restricted: false
    },
    62: {
        id: '62',
        name: 'Prospect Ridge',
        country: 'USA',
        surface: 'Gravel',
        distance: 7.8,
        shakedown_allowed: false,
        restricted: false
    },
    63: {
        id: '63',
        name: 'Diamond Creek',
        country: 'USA',
        surface: 'Gravel',
        distance: 7.1,
        shakedown_allowed: false,
        restricted: false
    },
    64: {
        id: '64',
        name: 'Hualapai Nation',
        country: 'USA',
        surface: 'Gravel',
        distance: 8.6,
        shakedown_allowed: false,
        restricted: false
    },
    65: {
        id: '65',
        name: 'Prospect Ridge II',
        country: 'USA',
        surface: 'Gravel',
        distance: 7.9,
        shakedown_allowed: false,
        restricted: false
    },
    66: {
        id: '66',
        name: 'Diamond Creek II',
        country: 'USA',
        surface: 'Gravel',
        distance: 6.8,
        shakedown_allowed: false,
        restricted: false
    },
    67: {
        id: '67',
        name: 'Hualapai Nation II',
        country: 'USA',
        surface: 'Gravel',
        distance: 8.6,
        shakedown_allowed: false,
        restricted: false
    },
    70: {
        id: '70',
        name: 'Prospect Ridge II A',
        country: 'USA',
        surface: 'Gravel',
        distance: 7.6,
        shakedown_allowed: false,
        restricted: false
    },
    71: {
        id: '71',
        name: 'Rally School Stage',
        country: 'Rally school',
        surface: 'Gravel',
        distance: 2.2,
        shakedown_allowed: false,
        restricted: false
    },
    90: {
        id: '90',
        name: 'Rally School Stage II',
        country: 'Rally school',
        surface: 'Gravel',
        distance: 2.3,
        shakedown_allowed: false,
        restricted: false
    },
    94: {
        id: '94',
        name: 'Stryckovy okruh',
        country: 'Czech Republic',
        surface: 'Tarmac',
        distance: 9.2,
        shakedown_allowed: false,
        restricted: false
    },
    95: {
        id: '95',
        name: 'Sumburk 2007',
        country: 'Czech Republic',
        surface: 'Tarmac',
        distance: 12.4,
        shakedown_allowed: false,
        restricted: false
    },
    96: {
        id: '96',
        name: 'Sosnova',
        country: 'Czech Republic',
        surface: 'Tarmac',
        distance: 7.1,
        shakedown_allowed: false,
        restricted: false
    },
    105: {
        id: '105',
        name: 'Sosnova 2010',
        country: 'Czech Republic',
        surface: 'Tarmac',
        distance: 4.2,
        shakedown_allowed: false,
        restricted: false
    },
    106: {
        id: '106',
        name: 'Stryckovy - Zadni Porici',
        country: 'Czech Republic',
        surface: 'Tarmac',
        distance: 6.9,
        shakedown_allowed: false,
        restricted: false
    },
    107: {
        id: '107',
        name: 'PTD Rallysprint',
        country: 'Netherlands',
        surface: 'Gravel',
        distance: 5.1,
        shakedown_allowed: false,
        restricted: false
    },
    108: {
        id: '108',
        name: 'Osli - Stryckovy',
        country: 'Czech Republic',
        surface: 'Tarmac',
        distance: 10.6,
        shakedown_allowed: false,
        restricted: false
    },
    125: {
        id: '125',
        name: 'Bergheim v1.1',
        country: 'Germany',
        surface: 'Tarmac',
        distance: 8,
        shakedown_allowed: false,
        restricted: false
    },
    131: {
        id: '131',
        name: 'Lyon - Gerland',
        country: 'France',
        surface: 'Tarmac',
        distance: 0.7,
        shakedown_allowed: false,
        restricted: false
    },
    132: {
        id: '132',
        name: 'Gestel',
        country: 'Netherlands',
        surface: 'Tarmac',
        distance: 7.2,
        shakedown_allowed: false,
        restricted: false
    },
    139: {
        id: '139',
        name: 'RSI slalom Shonen',
        country: 'Ireland',
        surface: 'Tarmac',
        distance: 1,
        shakedown_allowed: false,
        restricted: false
    },
    140: {
        id: '140',
        name: 'RSI slalom gegeWRC',
        country: 'Ireland',
        surface: 'Tarmac',
        distance: 1.8,
        shakedown_allowed: false,
        restricted: false
    },
    141: {
        id: '141',
        name: 'Mlynky',
        country: 'Slovakia',
        surface: 'Tarmac',
        distance: 7.1,
        shakedown_allowed: false,
        restricted: false
    },
    142: {
        id: '142',
        name: 'Mlynky Snow',
        country: 'Slovakia',
        surface: 'Snow',
        distance: 7.1,
        shakedown_allowed: false,
        restricted: false
    },
    143: {
        id: '143',
        name: 'Peklo',
        country: 'Slovakia',
        surface: 'Tarmac',
        distance: 8.5,
        shakedown_allowed: false,
        restricted: false
    },
    144: {
        id: '144',
        name: 'Peklo Snow',
        country: 'Slovakia',
        surface: 'Snow',
        distance: 8.5,
        shakedown_allowed: false,
        restricted: false
    },
    145: {
        id: '145',
        name: 'Versme',
        country: 'Lithuania',
        surface: 'Gravel',
        distance: 3.2,
        shakedown_allowed: false,
        restricted: false
    },
    146: {
        id: '146',
        name: 'Peklo II',
        country: 'Slovakia',
        surface: 'Tarmac',
        distance: 8.5,
        shakedown_allowed: false,
        restricted: false
    },
    147: {
        id: '147',
        name: 'Peklo II Snow',
        country: 'Slovakia',
        surface: 'Snow',
        distance: 8.5,
        shakedown_allowed: false,
        restricted: false
    },
    148: {
        id: '148',
        name: 'ROC 2008',
        country: 'Great Britain',
        surface: 'Tarmac',
        distance: 2,
        shakedown_allowed: false,
        restricted: false
    },
    149: {
        id: '149',
        name: 'Sieversdorf V1.1',
        country: 'Germany',
        surface: 'Tarmac',
        distance: 8,
        shakedown_allowed: false,
        restricted: false
    },
    152: {
        id: '152',
        name: 'RP 2009 Shakedown',
        country: 'Poland',
        surface: 'Gravel',
        distance: 4.4,
        shakedown_allowed: false,
        restricted: false
    },
    153: {
        id: '153',
        name: 'RP 2009 Shakedown Reversed',
        country: 'Poland',
        surface: 'Gravel',
        distance: 4.4,
        shakedown_allowed: false,
        restricted: false
    },
    154: {
        id: '154',
        name: 'Bruchsal-Unteroewisheim',
        country: 'Germany',
        surface: 'Tarmac',
        distance: 8.9,
        shakedown_allowed: false,
        restricted: false
    },
    155: {
        id: '155',
        name: 'Humalamaki 1.0',
        country: 'Finland',
        surface: 'Gravel',
        distance: 4.4,
        shakedown_allowed: false,
        restricted: false
    },
    156: {
        id: '156',
        name: 'Mlynky II',
        country: 'Slovakia',
        surface: 'Tarmac',
        distance: 7.1,
        shakedown_allowed: false,
        restricted: false
    },
    157: {
        id: '157',
        name: 'Grand Canaria ROC 2000',
        country: 'Spain',
        surface: 'Gravel',
        distance: 3.8,
        shakedown_allowed: false,
        restricted: false
    },
    158: {
        id: '158',
        name: 'Sweet Lamb',
        country: 'Great Britain',
        surface: 'Gravel',
        distance: 5.1,
        shakedown_allowed: false,
        restricted: false
    },
    159: {
        id: '159',
        name: 'Sweet Lamb II',
        country: 'Great Britain',
        surface: 'Gravel',
        distance: 5.1,
        shakedown_allowed: false,
        restricted: false
    },
    471: {
        id: '471',
        name: 'Aragona',
        country: 'Italy',
        surface: 'Tarmac',
        distance: 6.4,
        shakedown_allowed: false,
        restricted: false
    },
    472: {
        id: '472',
        name: 'Muxarello',
        country: 'Italy',
        surface: 'Tarmac',
        distance: 15.4,
        shakedown_allowed: false,
        restricted: false
    },
    478: {
        id: '478',
        name: 'Rallysprint Hondarribia 2011',
        country: 'Spain',
        surface: 'Tarmac',
        distance: 8,
        shakedown_allowed: false,
        restricted: false
    },
    479: {
        id: '479',
        name: 'Shomaru Pass',
        country: 'Japan',
        surface: 'Tarmac',
        distance: 5.8,
        shakedown_allowed: false,
        restricted: false
    },
    480: {
        id: '480',
        name: 'Shomaru Pass II',
        country: 'Japan',
        surface: 'Tarmac',
        distance: 5.8,
        shakedown_allowed: false,
        restricted: false
    },
    481: {
        id: '481',
        name: 'Karlstad',
        country: 'Sweeden',
        surface: 'Snow',
        distance: 1.9,
        shakedown_allowed: false,
        restricted: false
    },
    482: {
        id: '482',
        name: 'Karlstad II',
        country: 'Sweeden',
        surface: 'Snow',
        distance: 1.9,
        shakedown_allowed: false,
        restricted: false
    },
    484: {
        id: '484',
        name: 'Humalamaki Reversed',
        country: 'Finland',
        surface: 'Gravel',
        distance: 4.4,
        shakedown_allowed: false,
        restricted: false
    },
    488: {
        id: '488',
        name: 'Jirkovicky',
        country: 'Montekland',
        surface: 'Gravel',
        distance: 3.5,
        shakedown_allowed: false,
        restricted: false
    },
    489: {
        id: '489',
        name: 'Jirkovicky II',
        country: 'Montekland',
        surface: 'Gravel',
        distance: 3.5,
        shakedown_allowed: false,
        restricted: false
    },
    490: {
        id: '490',
        name: 'Sourkov',
        country: 'Montekland',
        surface: 'Gravel',
        distance: 6.2,
        shakedown_allowed: false,
        restricted: false
    },
    491: {
        id: '491',
        name: 'Lernovec',
        country: 'Montekland',
        surface: 'Gravel',
        distance: 5,
        shakedown_allowed: false,
        restricted: false
    },
    492: {
        id: '492',
        name: 'Uzkotin',
        country: 'Montekland',
        surface: 'Gravel',
        distance: 7.8,
        shakedown_allowed: false,
        restricted: false
    },
    493: {
        id: '493',
        name: 'Hroudovany',
        country: 'Montekland',
        surface: 'Gravel',
        distance: 7.1,
        shakedown_allowed: false,
        restricted: false
    },
    494: {
        id: '494',
        name: 'Snekovice',
        country: 'Montekland',
        surface: 'Gravel',
        distance: 8.6,
        shakedown_allowed: false,
        restricted: false
    },
    495: {
        id: '495',
        name: 'Lernovec II',
        country: 'Montekland',
        surface: 'Gravel',
        distance: 5,
        shakedown_allowed: false,
        restricted: false
    },
    496: {
        id: '496',
        name: 'Uzkotin II',
        country: 'Montekland',
        surface: 'Gravel',
        distance: 7.6,
        shakedown_allowed: false,
        restricted: false
    },
    497: {
        id: '497',
        name: 'Hroudovany II',
        country: 'Montekland',
        surface: 'Gravel',
        distance: 7.1,
        shakedown_allowed: false,
        restricted: false
    },
    498: {
        id: '498',
        name: 'Snekovice II',
        country: 'Montekland',
        surface: 'Gravel',
        distance: 8.6,
        shakedown_allowed: false,
        restricted: false
    },
    499: {
        id: '499',
        name: 'Sourkov 2',
        country: 'Montekland',
        surface: 'Gravel',
        distance: 6.2,
        shakedown_allowed: false,
        restricted: false
    },
    516: {
        id: '516',
        name: 'Hradek 1',
        country: 'Czech Republic',
        surface: 'Tarmac',
        distance: 5.8,
        shakedown_allowed: false,
        restricted: false
    },
    517: {
        id: '517',
        name: 'Hradek 2',
        country: 'Czech Republic',
        surface: 'Tarmac',
        distance: 5.8,
        shakedown_allowed: false,
        restricted: false
    },
    518: {
        id: '518',
        name: 'Liptakov 1',
        country: 'Czech Republic',
        surface: 'Tarmac',
        distance: 6,
        shakedown_allowed: false,
        restricted: false
    },
    519: {
        id: '519',
        name: 'Liptakov 2',
        country: 'Czech Republic',
        surface: 'Tarmac',
        distance: 6,
        shakedown_allowed: false,
        restricted: false
    },
    522: {
        id: '522',
        name: 'Rally School Czech',
        country: 'Czech Republic',
        surface: 'Tarmac',
        distance: 3.2,
        shakedown_allowed: false,
        restricted: false
    },
    524: {
        id: '524',
        name: 'Rally School Czech II',
        country: 'Czech Republic',
        surface: 'Tarmac',
        distance: 3.1,
        shakedown_allowed: false,
        restricted: false
    },
    528: {
        id: '528',
        name: 'Kuadonvaara',
        country: 'Finland',
        surface: 'Snow',
        distance: 5.7,
        shakedown_allowed: false,
        restricted: false
    },
    533: {
        id: '533',
        name: 'Karowa 2009',
        country: 'Poland',
        surface: 'Tarmac',
        distance: 1.6,
        shakedown_allowed: false,
        restricted: false
    },
    534: {
        id: '534',
        name: 'Haugenau 2012',
        country: 'France',
        surface: 'Tarmac',
        distance: 5.7,
        shakedown_allowed: false,
        restricted: false
    },
    544: {
        id: '544',
        name: 'Fernet Branca',
        country: 'Argentina',
        surface: 'Gravel',
        distance: 6,
        shakedown_allowed: false,
        restricted: false
    },
    545: {
        id: '545',
        name: 'Junior Wheels I',
        country: 'Australia',
        surface: 'Gravel',
        distance: 5.6,
        shakedown_allowed: false,
        restricted: false
    },
    546: {
        id: '546',
        name: 'Junior Wheels II',
        country: 'Australia',
        surface: 'Gravel',
        distance: 5.6,
        shakedown_allowed: false,
        restricted: false
    },
    550: {
        id: '550',
        name: 'Foron',
        country: 'France',
        surface: 'Tarmac',
        distance: 9.2,
        shakedown_allowed: false,
        restricted: false
    },
    551: {
        id: '551',
        name: 'Foron II',
        country: 'France',
        surface: 'Tarmac',
        distance: 9.2,
        shakedown_allowed: false,
        restricted: false
    },
    552: {
        id: '552',
        name: 'Foron Snow',
        country: 'France',
        surface: 'Snow',
        distance: 9.1,
        shakedown_allowed: false,
        restricted: false
    },
    553: {
        id: '553',
        name: 'Foron Snow II',
        country: 'France',
        surface: 'Snow',
        distance: 9.1,
        shakedown_allowed: false,
        restricted: false
    },
    555: {
        id: '555',
        name: 'Maton I',
        country: 'France',
        surface: 'Tarmac',
        distance: 3.5,
        shakedown_allowed: false,
        restricted: false
    },
    556: {
        id: '556',
        name: 'Maton II',
        country: 'France',
        surface: 'Tarmac',
        distance: 3.5,
        shakedown_allowed: false,
        restricted: false
    },
    557: {
        id: '557',
        name: 'Red Bull HC',
        country: 'Italy',
        surface: 'Gravel',
        distance: 14,
        shakedown_allowed: false,
        restricted: false
    },
    558: {
        id: '558',
        name: 'Maton snow',
        country: 'France',
        surface: 'Snow',
        distance: 3.5,
        shakedown_allowed: false,
        restricted: false
    },
    559: {
        id: '559',
        name: 'Maton snow II',
        country: 'France',
        surface: 'Snow',
        distance: 3.5,
        shakedown_allowed: false,
        restricted: false
    },
    560: {
        id: '560',
        name: 'Loch Ard',
        country: 'Great Britain',
        surface: 'Gravel',
        distance: 8.3,
        shakedown_allowed: false,
        restricted: false
    },
    561: {
        id: '561',
        name: 'Loch Ard II',
        country: 'Great Britain',
        surface: 'Gravel',
        distance: 8.3,
        shakedown_allowed: false,
        restricted: false
    },
    565: {
        id: '565',
        name: 'Undva Reversed',
        country: 'Estonia',
        surface: 'Gravel',
        distance: 10,
        shakedown_allowed: false,
        restricted: false
    },
    566: {
        id: '566',
        name: 'Undva',
        country: 'Estonia',
        surface: 'Gravel',
        distance: 10,
        shakedown_allowed: false,
        restricted: false
    },
    570: {
        id: '570',
        name: 'Peyregrosse - Mandagout',
        country: 'France',
        surface: 'Tarmac',
        distance: 12.8,
        shakedown_allowed: false,
        restricted: false
    },
    571: {
        id: '571',
        name: 'Peyregrosse - Mandagout NIGHT',
        country: 'France',
        surface: 'Tarmac',
        distance: 12.8,
        shakedown_allowed: false,
        restricted: false
    },
    572: {
        id: '572',
        name: 'Castrezzato',
        country: 'Italy',
        surface: 'Tarmac',
        distance: 8.1,
        shakedown_allowed: false,
        restricted: false
    },
    573: {
        id: '573',
        name: 'SS Daniel Bonara',
        country: 'Italy',
        surface: 'Tarmac',
        distance: 5.5,
        shakedown_allowed: false,
        restricted: false
    },
    574: {
        id: '574',
        name: 'Sorica',
        country: 'Slovenia',
        surface: 'Tarmac',
        distance: 15.5,
        shakedown_allowed: false,
        restricted: false
    },
    582: {
        id: '582',
        name: 'Barum rally 2009 Semetin',
        country: 'Czech Republic',
        surface: 'Tarmac',
        distance: 11.7,
        shakedown_allowed: false,
        restricted: false
    },
    583: {
        id: '583',
        name: 'Barum rally 2010 Semetin',
        country: 'Czech Republic',
        surface: 'Tarmac',
        distance: 11.7,
        shakedown_allowed: false,
        restricted: false
    },
    585: {
        id: '585',
        name: 'SWISS II',
        country: 'Switzerland',
        surface: 'Gravel',
        distance: 5.6,
        shakedown_allowed: false,
        restricted: false
    },
    586: {
        id: '586',
        name: 'SWISS I',
        country: 'Switzerland',
        surface: 'Tarmac',
        distance: 5.6,
        shakedown_allowed: false,
        restricted: false
    },
    587: {
        id: '587',
        name: 'Swiss IV',
        country: 'Swiss',
        surface: 'Gravel',
        distance: 8.2,
        shakedown_allowed: false,
        restricted: false
    },
    589: {
        id: '589',
        name: 'Swiss III',
        country: 'Swiss',
        surface: 'Tarmac',
        distance: 8.2,
        shakedown_allowed: false,
        restricted: false
    },
    590: {
        id: '590',
        name: 'Blanare',
        country: 'France',
        surface: 'Snow',
        distance: 7.6,
        shakedown_allowed: false,
        restricted: false
    },
    591: {
        id: '591',
        name: 'Blanare II',
        country: 'France',
        surface: 'Snow',
        distance: 6.6,
        shakedown_allowed: false,
        restricted: false
    },
    592: {
        id: '592',
        name: 'Slovakia Ring 2014',
        country: 'Slovakia',
        surface: 'Tarmac',
        distance: 11,
        shakedown_allowed: false,
        restricted: false
    },
    593: {
        id: '593',
        name: 'Slovakia Ring 2014 II',
        country: 'Slovakia',
        surface: 'Tarmac',
        distance: 11,
        shakedown_allowed: false,
        restricted: false
    },
    595: {
        id: '595',
        name: 'Sardian',
        country: 'USA',
        surface: 'Tarmac',
        distance: 5.1,
        shakedown_allowed: false,
        restricted: false
    },
    596: {
        id: '596',
        name: 'Sardian Night',
        country: 'USA',
        surface: 'Tarmac',
        distance: 5.1,
        shakedown_allowed: false,
        restricted: false
    },
    597: {
        id: '597',
        name: 'Mlynky Snow II',
        country: 'Slovakia',
        surface: 'Snow',
        distance: 7.1,
        shakedown_allowed: false,
        restricted: false
    },
    598: {
        id: '598',
        name: 'Pikes Peak 2008',
        country: 'USA',
        surface: 'Tarmac',
        distance: 19.9,
        shakedown_allowed: false,
        restricted: false
    },
    599: {
        id: '599',
        name: 'Northumbria',
        country: 'Great Britain',
        surface: 'Gravel',
        distance: 9,
        shakedown_allowed: false,
        restricted: false
    },
    601: {
        id: '601',
        name: 'Northumbria Tarmac',
        country: 'Great Britain',
        surface: 'Tarmac',
        distance: 9,
        shakedown_allowed: false,
        restricted: false
    },
    607: {
        id: '607',
        name: 'Sturec',
        country: 'Slovakia',
        surface: 'Tarmac',
        distance: 8.1,
        shakedown_allowed: false,
        restricted: false
    },
    608: {
        id: '608',
        name: 'Sturec II',
        country: 'Slovakia',
        surface: 'Tarmac',
        distance: 8.2,
        shakedown_allowed: false,
        restricted: false
    },
    611: {
        id: '611',
        name: 'Capo Di Feno',
        country: 'France',
        surface: 'Tarmac',
        distance: 4.5,
        shakedown_allowed: false,
        restricted: false
    },
    612: {
        id: '612',
        name: 'Capo Di Feno II',
        country: 'France',
        surface: 'Tarmac',
        distance: 4.5,
        shakedown_allowed: false,
        restricted: false
    },
    700: {
        id: '700',
        name: 'Passo Valle',
        country: 'Italy',
        surface: 'Tarmac',
        distance: 5.8,
        shakedown_allowed: false,
        restricted: false
    },
    701: {
        id: '701',
        name: 'Passo Valle Reverse',
        country: 'Itally',
        surface: 'Tarmac',
        distance: 5.8,
        shakedown_allowed: false,
        restricted: false
    },
    703: {
        id: '703',
        name: 'Lousada - WRC',
        country: 'Portugal',
        surface: 'Gravel',
        distance: 3.3,
        shakedown_allowed: false,
        restricted: false
    },
    704: {
        id: '704',
        name: 'Lousada - RX',
        country: 'Portugal',
        surface: 'Tarmac',
        distance: 3.6,
        shakedown_allowed: false,
        restricted: false
    },
    705: {
        id: '705',
        name: 'Lousada - RG',
        country: 'Portugal',
        surface: 'Gravel',
        distance: 3.8,
        shakedown_allowed: false,
        restricted: false
    },
    707: {
        id: '707',
        name: 'Carvalho de Rei 2008 II',
        country: 'Portugal',
        surface: 'Gravel',
        distance: 8.2,
        shakedown_allowed: false,
        restricted: false
    },
    708: {
        id: '708',
        name: 'Carvalho de Rei 2008',
        country: 'Portugal',
        surface: 'Gravel',
        distance: 8.2,
        shakedown_allowed: false,
        restricted: false
    },
    709: {
        id: '709',
        name: 'Travanca do Monte',
        country: 'Portugal',
        surface: 'Gravel',
        distance: 3,
        shakedown_allowed: false,
        restricted: false
    },
    711: {
        id: '711',
        name: 'Akagi Mountain',
        country: 'Japan',
        surface: 'Tarmac',
        distance: 3.5,
        shakedown_allowed: false,
        restricted: false
    },
    712: {
        id: '712',
        name: 'Akagi Mountain II',
        country: 'Japan',
        surface: 'Tarmac',
        distance: 3.5,
        shakedown_allowed: false,
        restricted: false
    },
    755: {
        id: '755',
        name: 'Dolmen',
        country: 'Italy',
        surface: 'Gravel',
        distance: 13.3,
        shakedown_allowed: false,
        restricted: false
    },
    777: {
        id: '777',
        name: 'Pian del Colle',
        country: 'Italy',
        surface: 'Tarmac',
        distance: 8.3,
        shakedown_allowed: false,
        restricted: false
    },
    778: {
        id: '778',
        name: 'Pian del Colle Reversed',
        country: 'Italy',
        surface: 'Tarmac',
        distance: 8.4,
        shakedown_allowed: false,
        restricted: false
    },
    779: {
        id: '779',
        name: 'Pian del Colle Snow',
        country: 'Italy',
        surface: 'Snow',
        distance: 8.3,
        shakedown_allowed: false,
        restricted: false
    },
    780: {
        id: '780',
        name: 'Pian del Colle Snow Reversed',
        country: 'Italy',
        surface: 'Snow',
        distance: 8.4,
        shakedown_allowed: false,
        restricted: false
    },
    800: {
        id: '800',
        name: 'Ai-Petri',
        country: 'Ukraine',
        surface: 'Tarmac',
        distance: 17.3,
        shakedown_allowed: false,
        restricted: false
    },
    801: {
        id: '801',
        name: 'Uchan-Su',
        country: 'Ukraine',
        surface: 'Tarmac',
        distance: 10.8,
        shakedown_allowed: false,
        restricted: false
    },
    802: {
        id: '802',
        name: 'Ai-Petri Winter',
        country: 'Ukraine',
        surface: 'Snow',
        distance: 17.3,
        shakedown_allowed: false,
        restricted: false
    },
    803: {
        id: '803',
        name: 'Uchan-Su Winter',
        country: 'Ukraine',
        surface: 'Snow',
        distance: 10.8,
        shakedown_allowed: false,
        restricted: false
    },
    810: {
        id: '810',
        name: 'Livadija',
        country: 'Ukraine',
        surface: 'Tarmac',
        distance: 5.5,
        shakedown_allowed: false,
        restricted: false
    },
    811: {
        id: '811',
        name: 'Livadija II',
        country: 'Ukraine',
        surface: 'Tarmac',
        distance: 5.5,
        shakedown_allowed: false,
        restricted: false
    },
    820: {
        id: '820',
        name: 'La Rocca',
        country: 'Italy',
        surface: 'Gravel',
        distance: 7.4,
        shakedown_allowed: false,
        restricted: false
    },
    830: {
        id: '830',
        name: 'Azov',
        country: 'Ukraine',
        surface: 'Gravel',
        distance: 19.1,
        shakedown_allowed: false,
        restricted: false
    },
    831: {
        id: '831',
        name: 'Azov II',
        country: 'Ukraine',
        surface: 'Gravel',
        distance: 19.2,
        shakedown_allowed: false,
        restricted: false
    },
    833: {
        id: '833',
        name: 'Shurdin II',
        country: 'Ukraine',
        surface: 'Gravel',
        distance: 22.1,
        shakedown_allowed: false,
        restricted: false
    },
    834: {
        id: '834',
        name: 'Shurdin I',
        country: 'Ukraine',
        surface: 'Gravel',
        distance: 22.1,
        shakedown_allowed: false,
        restricted: false
    },
    886: {
        id: '886',
        name: 'Zaraso Salos Trekas - 5 laps',
        country: 'Lithuania',
        surface: 'Gravel',
        distance: 5,
        shakedown_allowed: false,
        restricted: false
    },
    887: {
        id: '887',
        name: 'Zaraso Salos Trekas - 2 laps',
        country: 'Lithuania',
        surface: 'Gravel',
        distance: 2,
        shakedown_allowed: false,
        restricted: false
    },
    888: {
        id: '888',
        name: 'Shakedown Rally del Salento 2014',
        country: 'Italy',
        surface: 'Tarmac',
        distance: 3.8,
        shakedown_allowed: false,
        restricted: false
    },
    911: {
        id: '911',
        name: 'Torre Vecchia',
        country: 'Italy',
        surface: 'Tarmac',
        distance: 9.8,
        shakedown_allowed: false,
        restricted: false
    },
    929: {
        id: '929',
        name: 'Svince',
        country: 'Czech Republic',
        surface: 'Tarmac',
        distance: 4.8,
        shakedown_allowed: false,
        restricted: false
    },
    930: {
        id: '930',
        name: 'Svince II',
        country: 'Czech Republic',
        surface: 'Tarmac',
        distance: 4.8,
        shakedown_allowed: false,
        restricted: false
    },
    969: {
        id: '969',
        name: 'Tavia',
        country: 'Italy',
        surface: 'Gravel',
        distance: 3.8,
        shakedown_allowed: false,
        restricted: false
    },
    979: {
        id: '979',
        name: 'Berica',
        country: 'Italy',
        surface: 'Gravel',
        distance: 14.8,
        shakedown_allowed: false,
        restricted: false
    },
    980: {
        id: '980',
        name: 'Rally Wisla Shakedown',
        country: 'Poland',
        surface: 'Tarmac',
        distance: 2.5,
        shakedown_allowed: false,
        restricted: false
    },
    981: {
        id: '981',
        name: 'Hyppyjulma gravel',
        country: 'Finland',
        surface: 'Gravel',
        distance: 6.1,
        shakedown_allowed: false,
        restricted: false
    },
    982: {
        id: '982',
        name: 'Hyppyjulma gravel II',
        country: 'Finland',
        surface: 'Gravel',
        distance: 6.1,
        shakedown_allowed: false,
        restricted: false
    },
    983: {
        id: '983',
        name: 'Hyppyjulma tarmac',
        country: 'Finland',
        surface: 'Tarmac',
        distance: 6.1,
        shakedown_allowed: false,
        restricted: false
    },
    984: {
        id: '984',
        name: 'Hyppyjulma tarmac II',
        country: 'Finland',
        surface: 'Tarmac',
        distance: 6.1,
        shakedown_allowed: false,
        restricted: false
    },
    985: {
        id: '985',
        name: 'Kolmenjarvet gravel',
        country: 'Finland',
        surface: 'Gravel',
        distance: 6.1,
        shakedown_allowed: false,
        restricted: false
    },
    986: {
        id: '986',
        name: 'Kolmenjarvet gravel II',
        country: 'Finland',
        surface: 'Gravel',
        distance: 6.1,
        shakedown_allowed: false,
        restricted: false
    },
    987: {
        id: '987',
        name: 'Kolmenjarvet tarmac',
        country: 'Finland',
        surface: 'Tarmac',
        distance: 6.1,
        shakedown_allowed: false,
        restricted: false
    },
    988: {
        id: '988',
        name: 'Kolmenjarvet tarmac II',
        country: 'Finland',
        surface: 'Tarmac',
        distance: 6.1,
        shakedown_allowed: false,
        restricted: false
    },
    989: {
        id: '989',
        name: 'Joukkovaara gravel',
        country: 'Finland',
        surface: 'Gravel',
        distance: 10.2,
        shakedown_allowed: false,
        restricted: false
    },
    990: {
        id: '990',
        name: 'Joukkovaara gravel II',
        country: 'Finland',
        surface: 'Gravel',
        distance: 10.2,
        shakedown_allowed: false,
        restricted: false
    },
    991: {
        id: '991',
        name: 'Joukkovaara tarmac',
        country: 'Finland',
        surface: 'Tarmac',
        distance: 10.2,
        shakedown_allowed: false,
        restricted: false
    },
    992: {
        id: '992',
        name: 'Joukkovaara tarmac II',
        country: 'Finland',
        surface: 'Tarmac',
        distance: 10.2,
        shakedown_allowed: false,
        restricted: false
    },
    993: {
        id: '993',
        name: 'Kormoran Shakedown',
        country: 'Poland',
        surface: 'Gravel',
        distance: 5.2,
        shakedown_allowed: false,
        restricted: false
    },
    994: {
        id: '994',
        name: 'Kormoran I',
        country: 'Poland',
        surface: 'Gravel',
        distance: 10.3,
        shakedown_allowed: false,
        restricted: false
    },
    995: {
        id: '995',
        name: 'Kormoran II',
        country: 'Poland',
        surface: 'Gravel',
        distance: 12,
        shakedown_allowed: false,
        restricted: false
    },
    996: {
        id: '996',
        name: 'SSS Mikolajki I',
        country: 'Poland',
        surface: 'Gravel',
        distance: 2.6,
        shakedown_allowed: false,
        restricted: false
    },
    997: {
        id: '997',
        name: 'SSS Mikolajki II',
        country: 'Poland',
        surface: 'Gravel',
        distance: 2.6,
        shakedown_allowed: false,
        restricted: false
    },
    998: {
        id: '998',
        name: 'SSS York I',
        country: 'Australia',
        surface: 'Gravel',
        distance: 4.3,
        shakedown_allowed: false,
        restricted: false
    },
    999: {
        id: '999',
        name: 'SSS York II',
        country: 'Australia',
        surface: 'Gravel',
        distance: 4.3,
        shakedown_allowed: false,
        restricted: false
    },
    1012: {
        id: '1012',
        name: 'Puy du Lac',
        country: 'France',
        surface: 'Tarmac',
        distance: 5,
        shakedown_allowed: false,
        restricted: false
    },
    1024: {
        id: '1024',
        name: 'GB Sprint Extreme',
        country: 'Great Britain',
        surface: 'Gravel',
        distance: 6.7,
        shakedown_allowed: false,
        restricted: false
    },
    1025: {
        id: '1025',
        name: 'FSO Zeran - Warsaw',
        country: 'Poland',
        surface: 'Tarmac',
        distance: 7.1,
        shakedown_allowed: false,
        restricted: false
    },
    1141: {
        id: '1141',
        name: 'Snow Cote D\'Arbroz',
        country: 'France',
        surface: 'Snow',
        distance: 4.5,
        shakedown_allowed: false,
        restricted: false
    },
    1142: {
        id: '1142',
        name: 'Snow Joux Verte',
        country: 'France',
        surface: 'Snow',
        distance: 7.9,
        shakedown_allowed: false,
        restricted: false
    },
    1143: {
        id: '1143',
        name: 'Snow Bisanne',
        country: 'France',
        surface: 'Snow',
        distance: 5.6,
        shakedown_allowed: false,
        restricted: false
    },
    1144: {
        id: '1144',
        name: 'Snow Joux Plane',
        country: 'France',
        surface: 'Snow',
        distance: 11.1,
        shakedown_allowed: false,
        restricted: false
    },
    1145: {
        id: '1145',
        name: 'Snow Joux Verte II',
        country: 'France',
        surface: 'Snow',
        distance: 7.9,
        shakedown_allowed: false,
        restricted: false
    },
    1146: {
        id: '1146',
        name: 'Snow Cote D\'Arbroz II',
        country: 'France',
        surface: 'Snow',
        distance: 4.5,
        shakedown_allowed: false,
        restricted: false
    },
    1147: {
        id: '1147',
        name: 'Snow Bisanne II',
        country: 'France',
        surface: 'Snow',
        distance: 5.6,
        shakedown_allowed: false,
        restricted: false
    },
    1148: {
        id: '1148',
        name: 'Snow Joux Plane II',
        country: 'France',
        surface: 'Snow',
        distance: 11.1,
        shakedown_allowed: false,
        restricted: false
    },
    1521: {
        id: '1521',
        name: 'Sherwood Forest I',
        country: 'Great Britain',
        surface: 'Gravel',
        distance: 13.5,
        shakedown_allowed: false,
        restricted: false
    },
    1522: {
        id: '1522',
        name: 'Sherwood Forest II',
        country: 'Great Britain',
        surface: 'Gravel',
        distance: 13.5,
        shakedown_allowed: false,
        restricted: false
    },
    1523: {
        id: '1523',
        name: 'Sherwood Forest I Summer',
        country: 'Great Britain',
        surface: 'Gravel',
        distance: 13.5,
        shakedown_allowed: false,
        restricted: false
    },
    1524: {
        id: '1524',
        name: 'Sherwood Forest II Summer',
        country: 'Great Britain',
        surface: 'Gravel',
        distance: 13.5,
        shakedown_allowed: false,
        restricted: false
    },
    1899: {
        id: '1899',
        name: 'Courcelles Val\'d Esnoms',
        country: 'France',
        surface: 'Tarmac',
        distance: 9.9,
        shakedown_allowed: false,
        restricted: false
    },
    1900: {
        id: '1900',
        name: 'Vieux Moulin-Perrancey',
        country: 'France',
        surface: 'Gravel',
        distance: 20.5,
        shakedown_allowed: false,
        restricted: false
    },
    1999: {
        id: '1999',
        name: 'Halenkovice SD',
        country: 'Czech Republic',
        surface: 'Tarmac',
        distance: 4.2,
        shakedown_allowed: false,
        restricted: false
    }
}
