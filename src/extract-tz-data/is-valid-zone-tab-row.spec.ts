import {isValidZoneTabRow} from './is-valid-zone-tab-row';

describe('.isValidZoneTabRow', () => {
    it('should allow rows with a single country code', () => {
        const validRow = [ 'AU', '-3157+14127', 'Australia/Broken_Hill', 'New South Wales (Yancowinna)' ];
        expect(isValidZoneTabRow(validRow)).toBe(true)
    });

    it('should allow rows with multiple country codes', () => {
        const validRow = ['GB,GG,IM,JE', '+513030-0000731', 'Europe/London'];
        expect(isValidZoneTabRow(validRow)).toBe(true)
    });

    it('should not allow rows with comments', () => {
        const invalidRow = ['# tz zone descriptions'];
        expect(isValidZoneTabRow(invalidRow)).toBe(false)
    })
});
