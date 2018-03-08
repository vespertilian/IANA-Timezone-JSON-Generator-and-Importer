import {loadIANATzJsonFile} from './load-iana-tz-json-file';

describe('loadIANATzJsonFile', () => {
    it('should load the specified json file from timezones', async() => {
        const allFieldsJSON = await loadIANATzJsonFile('2018c-zone-all-fields.json');
        expect(JSON.parse(allFieldsJSON).numberOfZones).toBeDefined();
    });

    it('should throw an error if the file does not exist', async() => {
        let error = null;
        try {
            await loadIANATzJsonFile('made-up-foo-file.json');
        } catch(e) {
            error = e;
        }

        expect(error.message.includes('File does not exist')).toBe(true);
        expect(error.message.includes('all-fields.json')).toBe(true)
    });
});