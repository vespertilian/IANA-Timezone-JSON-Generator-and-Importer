import {formatLocation} from './format-location';

describe('formatLocation', () => {
    it('should turn a location string into a location object', () => {
        expect(formatLocation('Sydney'))
            .toEqual('Sydney');

        expect(formatLocation('Argentina/Tucuman'))
            .toEqual('Argentina - Tucuman');

        expect(formatLocation('Cape_Verde'))
            .toEqual('Cape Verde');
    })
});