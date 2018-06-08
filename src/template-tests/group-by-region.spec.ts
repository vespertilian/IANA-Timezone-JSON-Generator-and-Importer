import {
    alphabeticGeographicAreaNameSort,
    createFiles as groupByRegionCreateFiles,
    formatLocation
} from '../../templates/group-by-region/group-by-region'

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
            {"geographicAreaName":"America","geographicAreaDisplayName":"America"},
            {"geographicAreaName":"Atlantic","geographicAreaDisplayName":"Atlantic Ocean"},
            {"geographicAreaName":"Australia","geographicAreaDisplayName":"Australia"},
            {"geographicAreaName":"Europe","geographicAreaDisplayName":"Europe"},
            {"geographicAreaName":"Indian","geographicAreaDisplayName":"Indian Ocean"},
            {"geographicAreaName":"Pacific","geographicAreaDisplayName":"Pacific Ocean"}
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
            comments: "Galápagos Islands"
        },
    ],
    originalFileName: 'zone-file-foo'
};