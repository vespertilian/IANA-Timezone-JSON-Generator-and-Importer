import {
    alphabeticGeographicAreaNameSort,
    createFiles as groupByRegionCreateFiles,
} from '../../templates/group-by-region-with-country-code/group-by-region-with-country-codes'

describe('group-by-region template', () => {
    it('should convert the data into the correct files', () => {
        const [america, atlantic, australia, europe, indian, pacific, geographicList] = groupByRegionCreateFiles(groupByRegionSampleExtractedData as any)

        const australiaValues = JSON.parse(australia.json);
        const americaValues = JSON.parse(america.json);
        const atlanticValues = JSON.parse(atlantic.json);

        expect(americaValues.locationList).toEqual([
            {"location": 'Argentina/Tucuman', "locationDisplayName": "Argentina - Tucuman", "countryCodes": ["AR"]}
        ]);

        expect(atlanticValues.locationList).toEqual([
            {"location": 'Cape_Verde', "locationDisplayName": "Cape Verde", "countryCodes": ["CV"]}
        ]);

        expect(australiaValues.locationList).toEqual([
            {"location": 'Sydney', "locationDisplayName": "Sydney", "countryCodes": ["AU"]},
            {"location": 'Melbourne', "locationDisplayName": "Melbourne", "countryCodes": ["AU"]}
        ]);

        const expectedGeographicList = [
            {"geographicArea":"America","geographicAreaDisplayName":"America"},
            {"geographicArea":"Atlantic","geographicAreaDisplayName":"Atlantic Ocean"},
            {"geographicArea":"Australia","geographicAreaDisplayName":"Australia"},
            {"geographicArea":"Europe","geographicAreaDisplayName":"Europe"},
            {"geographicArea":"Indian","geographicAreaDisplayName":"Indian Ocean"},
            {"geographicArea":"Pacific","geographicAreaDisplayName":"Pacific Ocean"}
        ];

        const geographicValues = JSON.parse(geographicList.json);
        expect(geographicValues).toEqual(expectedGeographicList);
    })
});

describe('alphabeticGeographicAreaNameSort', () => {
    it('should return -1 when name a is before name b', () => {
        const a = {geographicAreaDisplayName: 'a'} as any;
        const b = {geographicAreaDisplayName: 'b'} as any;
        expect(alphabeticGeographicAreaNameSort(a, b)).toEqual(-1)
    });

    it('should return 1 when name b is before name a', () => {
        const a = {geographicAreaDisplayName: 'd'} as any;
        const b = {geographicAreaDisplayName: 'c'} as any;
        expect(alphabeticGeographicAreaNameSort(a, b)).toEqual(1)
    });

    it('should return 0 when the names are equal', () => {
        const a = {geographicAreaDisplayName: 'e'} as any;
        const b = {geographicAreaDisplayName: 'e'} as any;
        expect(alphabeticGeographicAreaNameSort(a, b)).toEqual(0)
    })
});

const groupByRegionSampleExtractedData = {
    version: 'sample-data-1',
    numberOfZones: 1,
    zones: [
        {
            countryCodes: ['AU'],
            timezoneName: 'Australia/Sydney',
            geographicArea: 'Australia',
            geographicAreaDisplayName: 'Australia',
            location: 'Sydney',
            locationDisplayName: 'Sydney',
            comments: 'New South Wales (most areas)'
        },
        {
            countryCodes: [
                'AU'
            ],
            geographicArea: 'Australia',
            timezoneName: 'Australia/Melbourne',
            geographicAreaDisplayName: 'Australia',
            location: 'Melbourne',
            locationDisplayName: 'Melbourne',
            comments: 'Victoria'
        },
        {
            countryCodes: [
                'AR'
            ],
            timezoneName: 'America/Argentina/Tucuman',
            geographicArea: 'America',
            geographicAreaDisplayName: 'America',
            location: 'Argentina/Tucuman',
            locationDisplayName: 'Argentina - Tucuman',
            comments: 'Tucumán (TM)'
        },
        {
            countryCodes: [
                'GB',
                'GG',
                'IM',
                'JE'
            ],
            timezoneName: 'Europe/London',
            geographicArea: 'Europe',
            geographicAreaDisplayName: 'Europe',
            location: 'London',
            locationDisplayName: 'London',
            comments: null
        },
        {
            countryCodes: [
                "CC"
            ],
            timezoneName: "Indian/Cocos",
            geographicArea: "Indian",
            geographicAreaDisplayName: "Indian Ocean",
            location: "Cocos",
            locationDisplayName: "Cocos",
            comments: null
        },
        {
            countryCodes: [
                "CV"
            ],
            timezoneName: "Atlantic/Cape_Verde",
            geographicArea: "Atlantic",
            geographicAreaDisplayName: "Atlantic Ocean",
            location: "Cape_Verde",
            locationDisplayName: "Cape Verde",
            comments: null
        },
        {
            countryCodes: [
                "EC"
            ],
            timezoneName: "Pacific/Galapagos",
            geographicArea: "Pacific",
            geographicAreaDisplayName: "Pacific Ocean",
            location: "Galapagos",
            locationDisplayName: "Galapgaos",
            comments: "Galápagos Islands"
        },
    ],
    originalFileName: 'zone-file-foo'
};