import {createFiles as groupByRegionCreateFiles} from '../../templates/group-by-region/group-by-region'

describe('group-by-region template', () => {
    it('should convert the data into the correct files', () => {
        const [australia, america, europe, indian, atlantic, pacific, geographicList] = groupByRegionCreateFiles(groupByRegionSampleExtractedData as any)

        const australiaValues = JSON.parse(australia.json);
        const americaValues = JSON.parse(america.json);

        expect(australiaValues.locationList).toEqual(['Sydney', 'Melbourne']);
        expect(americaValues.locationList).toEqual(['Argentina/Tucuman']);

        const expectedGeographicList = [
            {"geographicAreaName":"Australia","displayName":"Australia"},
            {"geographicAreaName":"America","displayName":"America"},
            {"geographicAreaName":"Europe","displayName":"Europe"},
            {"geographicAreaName":"Indian","displayName":"Indian Ocean"},
            {"geographicAreaName":"Atlantic","displayName":"Atlantic Ocean"},
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