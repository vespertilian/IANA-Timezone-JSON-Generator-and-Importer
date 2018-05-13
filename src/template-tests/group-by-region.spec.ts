import {IExtractedTimezoneData} from '../types-for-ts-templates';
import {createFiles as groupByRegionCreateFiles} from '../../templates/group-by-region/group-by-region'

describe('group-by-region template', () => {
    it('should convert the data into the correct files', () => {
        const [australia, america, europe] = groupByRegionCreateFiles(groupByRegionSampleExtractedData)

        const australiaValues = JSON.parse(australia.json);
        const americaValues = JSON.parse(america.json);

        expect(australiaValues.locationList).toEqual(['Sydney', 'Melbourne']);
        expect(americaValues.locationList).toEqual(['Argentina/Tucuman']);
    })
});

const groupByRegionSampleExtractedData: IExtractedTimezoneData = {
    version: 'sample-data-1',
    numberOfZones: 1,
    zones: [
        {
            countryCodes: ['AU'],
            coordinates: {
                latitude: {
                    negative: true,
                    sign: '-',
                    degree: 33,
                    minute: 52,
                    second: null,
                    decimal: -33.866667,
                },
                longitude: {
                    negative: false,
                    sign: '+',
                    degree: 151,
                    minute: 13,
                    second: null,
                    decimal: 151.216667
                }
            },
            timezoneName: 'Australia/Sydney',
            geographicArea: 'Australia',
            location: 'Sydney',
            comments: 'New South Wales (most areas)'
        },
        {
            countryCodes: [
                'AU'
            ],

            coordinates: {
                latitude: {
                    negative: true,
                    sign: "-",
                    degree: 37,
                    minute: 49,
                    second: null,
                    decimal: -37.816667
                },
                longitude: {
                    negative: false,
                    sign: "+",
                    degree: 144,
                    minute: 58,
                    second: null,
                    decimal: 144.966667
                }
            },
            timezoneName: 'Australia/Melbourne',
            geographicArea: 'Australia',
            location: 'Melbourne',
            comments: 'Victoria'
        },
        {
            countryCodes: [
                'AR'
            ],
            coordinates: {
                latitude: {
                    negative: true,
                    sign: '-',
                    degree: 26,
                    minute: 49,
                    second: null,
                    decimal: -26.816667
                },
                longitude: {
                    negative: true,
                    sign: '-',
                    degree: 65,
                    minute: 13,
                    second: null,
                    decimal: -65.216667
                }
            },
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
            coordinates: {
                latitude: {
                    negative: false,
                    sign: '+',
                    degree: 51,
                    minute: 30,
                    second: 30,
                    decimal: 51.508333
                },
                longitude: {
                    negative: true,
                    sign: '-',
                    degree: 0,
                    minute: 7,
                    second: 31,
                    decimal: -0.125278
                }
            },
            timezoneName: 'Europe/London',
            geographicArea: 'Europe',
            location: 'London',
            comments: null
        },
    ],
    originalFileName: 'zone-file-foo'
};