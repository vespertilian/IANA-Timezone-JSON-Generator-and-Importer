import {createFiles as groupByRegionCreateFiles, formatLocation} from '../../templates/group-by-region/group-by-region'

describe('formatLocation', () => {
    it('should turn a location string into a location object', () => {
        expect(formatLocation('Sydney'))
            .toEqual({location: 'Sydney', displayName: 'Sydney'});

        expect(formatLocation('Argentina/Tucuman'))
            .toEqual({location: 'Argentina/Tucuman', displayName: 'Argentina - Tucuman'});

        expect(formatLocation('Cape_Verde'))
            .toEqual({location: 'Cape_Verde', displayName: 'Cape Verde'});
    })
});

describe('group-by-region template', () => {
    it('should convert the data into the correct files', () => {
        const [america, atlantic, australia, europe, indian, pacific, geographicList] = groupByRegionCreateFiles(groupByRegionSampleExtractedData as any)

        const australiaValues = JSON.parse(australia.json);
        const americaValues = JSON.parse(america.json);
        const atlanticValues = JSON.parse(atlantic.json);

        expect(americaValues.locationList).toEqual([
            {"location": 'Argentina/Tucuman', "displayName": "Argentina - Tucuman"}
        ]);

        expect(atlanticValues.locationList).toEqual([
            {"location": 'Cape_Verde', "displayName": "Cape Verde"}
        ]);

        expect(australiaValues.locationList).toEqual([
            {"location": 'Sydney', "displayName": "Sydney"},
            {"location": 'Melbourne', "displayName": "Melbourne"}
        ]);

        const expectedGeographicList = [
            {"geographicAreaName":"America","displayName":"America"},
            {"geographicAreaName":"Atlantic","displayName":"Atlantic Ocean"},
            {"geographicAreaName":"Australia","displayName":"Australia"},
            {"geographicAreaName":"Europe","displayName":"Europe"},
            {"geographicAreaName":"Indian","displayName":"Indian Ocean"},
            {"geographicAreaName":"Pacific","displayName":"Pacific Ocean"}
        ];

        const geographicValues = JSON.parse(geographicList.json);
        expect(geographicValues).toEqual(expectedGeographicList);
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
            location: 'Sydney',
            comments: 'New South Wales (most areas)'
        },
        {
            countryCodes: [
                'AU'
            ],
            timezoneName: 'Australia/Melbourne',
            geographicArea: 'Australia',
            location: 'Melbourne',
            comments: 'Victoria'
        },
        {
            countryCodes: [
                'AR'
            ],
            timezoneName: 'America/Argentina/Tucuman',
            geographicArea: 'America',
            location: 'Argentina/Tucuman',
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
            location: 'London',
            comments: null
        },
        {
            countryCodes: [
                "CC"
            ],
            timezoneName: "Indian/Cocos",
            geographicArea: "Indian",
            location: "Cocos",
            comments: null
        },
        {
            countryCodes: [
                "CV"
            ],
            timezoneName: "Atlantic/Cape_Verde",
            geographicArea: "Atlantic",
            location: "Cape_Verde",
            comments: null
        },
        {
            countryCodes: [
                "EC"
            ],
            timezoneName: "Pacific/Galapagos",
            geographicArea: "Pacific",
            location: "Galapagos",
            comments: "Galápagos Islands"
        },
    ],
    originalFileName: 'zone-file-foo'
};