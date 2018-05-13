import {createJsonFromTsFunctions} from './create-json-from-ts-functions';
import {sampleExtractedData} from '../create-json-from-templates-and-zone-data/test-extracted-data';
import {ICreateJSONFromTemplatesParams} from '../create-json-from-templates-and-zone-data/create-json-from-templates-and-zone-data';
import * as path from 'path';

describe('.createJSONFromTsFunctions', () => {
    const params: ICreateJSONFromTemplatesParams = {
        templateFileNames: ['test.ts'],
        extractedZoneData: sampleExtractedData,
        templatesPath: path.join(__dirname),
        zoneFileName: 'foo-zone.tab',
        saveDirectory: 'dira/dirb/saveDirFoo'
    };

    it('should create files using the createFiles method in the template', async() => {
        const writeFileAsyncStub = jasmine
            .createSpy('writeFileAsyncSpy');

        const ensureExistsAsync = jasmine.createSpy('ensureExists');

        await createJsonFromTsFunctions(params, writeFileAsyncStub, ensureExistsAsync);

        const fileWritePath = writeFileAsyncStub.calls.first().args[0];
        const jsonString = writeFileAsyncStub.calls.first().args[1].toString();

        expect(fileWritePath).toEqual('dira/dirb/saveDirFoo/sample-data-1-foo-zone-file-a.json');
        expect(JSON.parse(jsonString)).toEqual({a: 1});

        expect(ensureExistsAsync).toHaveBeenCalledWith('dira/dirb/saveDirFoo')
    })
});