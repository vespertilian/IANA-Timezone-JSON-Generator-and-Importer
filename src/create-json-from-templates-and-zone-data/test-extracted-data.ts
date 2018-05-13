import {IExtractedTimezoneData} from '../types-for-ts-templates';

export const sampleExtractedData: IExtractedTimezoneData = {
    version: 'sample-data-1',
    numberOfZones: 1,
    zones: [
        {
            countryCodes: ['AU', 'EU'],
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
        }
    ],
    originalFileName: 'Some file'
};
