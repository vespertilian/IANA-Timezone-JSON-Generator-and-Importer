// From the IANA timezone theory file
// Names normally have the form AREA/LOCATION,
// where AREA is the name of a continent or ocean,
// and LOCATION is the name of a specific location within that region.
// North and South America share the same area, 'America'.
// Typical names are 'Africa/Cairo', 'America/New_York', and 'Pacific/Honolulu'.

import {extractGeographicAreaAndLocation} from './extract-geographic-area-and-location';

describe('extract geographic area and location', () => {
    it('should extract geographic area and location from a two parameter tz', () => {
        const {geographicArea, location} = extractGeographicAreaAndLocation('Europe/Andorra');

        expect(geographicArea).toEqual('Europe');
        expect(location).toEqual('Andorra')
    });

    it('should extract geographic area and location from a three parameter tz', () =>{
        const {geographicArea, location} = extractGeographicAreaAndLocation('America/Argentina/Buenos_Aires');

        expect(geographicArea).toEqual('America');
        expect(location).toEqual('Argentina/Buenos_Aires')
    })
});
