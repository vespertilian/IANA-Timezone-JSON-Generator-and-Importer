import {createJsonFromTsFunctions} from './create-json-from-ts-functions';
import {sampleExtractedData} from '../create-json-from-templates-and-zone-data/test-extracted-data';
import {ICreateJSONFromTemplatesParams} from '../create-json-from-templates-and-zone-data/create-json-from-templates-and-zone-data';
import * as path from 'path';

describe('.createJSONFromTsFunctions', () => {

    it('should create files using the createFiles method in the template', async() => {
        const params: ICreateJSONFromTemplatesParams = {
            templateFileNames: ['test.ts'],
            extractedZoneData: sampleExtractedData,
            templatesPath: path.join(__dirname),
            zoneFileName: 'foo-zone.tab',
            saveDirectory: 'dira/dirb/saveDirFoo'
        };
        const writeFileAsyncStub = jasmine
            .createSpy('writeFileAsyncSpy');

        const ensureExistsAsync = jasmine.createSpy('ensureExists');
        const logSpy = jasmine.createSpy('console.log');

        await createJsonFromTsFunctions(
            params,
            writeFileAsyncStub,
            ensureExistsAsync,
            logSpy
        );

        const fileWritePath = writeFileAsyncStub.calls.first().args[0];
        const jsonString = writeFileAsyncStub.calls.first().args[1].toString();

        // logs file creation
        expect(logSpy).toHaveBeenCalledWith('Creating JSON for: test.ts with foo-zone.tab');

        expect(fileWritePath).toEqual('dira/dirb/saveDirFoo/sample-data-1-foo-zone-file-a.json');
        expect(JSON.parse(jsonString)).toEqual({a: 1});

        expect(ensureExistsAsync).toHaveBeenCalledWith('dira/dirb/saveDirFoo')
    });

    it('should save files using the directory the file was originally in', async() => {
        const params: ICreateJSONFromTemplatesParams = {
            templateFileNames: ['test-dir/testb.ts'],
            extractedZoneData: sampleExtractedData,
            templatesPath: path.join(__dirname),
            zoneFileName: 'foo-zone.tab',
            saveDirectory: 'dira/dirb/saveDirFoo'
        };

        const writeFileAsyncStub = jasmine
            .createSpy('writeFileAsyncSpy');

        const ensureExistsAsync = jasmine.createSpy('ensureExists');
        const logSpy = jasmine.createSpy('console.log');

        await createJsonFromTsFunctions(
            params,
            writeFileAsyncStub,
            ensureExistsAsync,
            logSpy
        );

        const fileWritePath = writeFileAsyncStub.calls.first().args[0];
        const jsonString = writeFileAsyncStub.calls.first().args[1].toString();

        // logs file creation
        expect(logSpy).toHaveBeenCalledWith('Creating JSON for: test-dir/testb.ts with foo-zone.tab');

        expect(fileWritePath).toEqual('dira/dirb/saveDirFoo/test-dir/sample-data-1-foo-zone-file-a.json');
        expect(JSON.parse(jsonString)).toEqual({a: 1});

        expect(ensureExistsAsync).toHaveBeenCalledWith('dira/dirb/saveDirFoo/test-dir')
    })

});