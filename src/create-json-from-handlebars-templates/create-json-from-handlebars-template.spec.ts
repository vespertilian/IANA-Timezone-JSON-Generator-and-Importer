import {
    createJSONFromHandlebarsTemplates,
    ICreateJSONFromHandlebarsTemplatesParams
} from './create-json-from-handlebars-templates';
import * as path from 'path';
import {readFileAsync} from '../util/util';
import {sampleExtractedData} from './test-extracted-data';

describe('create-json-from-handlebars-template', () => {
    describe('.createJSONFromHandlebarsTemplates', () => {
        const params: ICreateJSONFromHandlebarsTemplatesParams = {
            handlebarsTemplateFileNames: ['aaa.hbs'],
            extractedZoneData: sampleExtractedData,
            templatesPath: 'some-template-path',
            zoneFileName: 'foo-zone.tab',
            saveDirectory: 'saveDirFoo'
        };

        it('should create a file for each handlebarTemplate', async() => {

            const writeFileAsyncStub = jasmine
                .createSpy('writeFileAsyncSpy');

            const readFileAsyncStub = jasmine
                .createSpy('readFileAsyncSpy')
                .and.returnValue(readFileAsync(path.join(__dirname, './test-template.hbs'), 'utf-8'));

            const logSpy = jasmine.createSpy('console.log');
            const ensureExistsAsync = jasmine.createSpy('ensureExists');

            await createJSONFromHandlebarsTemplates(
                params,
                writeFileAsyncStub,
                readFileAsyncStub,
                ensureExistsAsync,
                logSpy
            );

            // logs file creation
            expect(logSpy).toHaveBeenCalledWith('Creating JSON for: aaa.hbs with foo-zone.tab');

            // reads handlebars template
            expect(readFileAsyncStub).toHaveBeenCalledWith(`some-template-path/aaa.hbs`, 'utf-8');

            // converts and writes to correct file path
            const fileWritePath = writeFileAsyncStub.calls.first().args[0];
            const jsonString = writeFileAsyncStub.calls.first().args[1].toString();

            const expectedJSON = {
                    numberOfZones: 1,
                    zones: [
                        {
                            countryCodes: ["AU", "EU"],
                            timezone: "Australia/Sydney"
                        }
                    ]
                };
            expect(fileWritePath).toEqual('saveDirFoo/sample-data-1-foo-zone-aaa.json');
            expect(JSON.parse(jsonString)).toEqual(expectedJSON);
        });

        it('should create a file for each handlebarTemplate in subdirectories', async() => {
            const multiFileParams: ICreateJSONFromHandlebarsTemplatesParams = {
                handlebarsTemplateFileNames: ['test-dir/aaa.hbs'],
                extractedZoneData: sampleExtractedData,
                templatesPath: 'some-template-path',
                zoneFileName: 'foo-zone.tab',
                saveDirectory: 'saveDirFoo'
            };

            const writeFileAsyncStub = jasmine
                .createSpy('writeFileAsyncSpy');

            const readFileAsyncStub = jasmine
                .createSpy('readFileAsyncSpy')
                .and.returnValue(readFileAsync(path.join(__dirname, './test-template.hbs'), 'utf-8'));

            const logSpy = jasmine.createSpy('console.log');
            const ensureExistsAsync = jasmine.createSpy('ensureExists');

            await createJSONFromHandlebarsTemplates(
                multiFileParams,
                writeFileAsyncStub,
                readFileAsyncStub,
                ensureExistsAsync,
                logSpy
            );

            // logs file creation
            expect(logSpy).toHaveBeenCalledWith('Creating JSON for: test-dir/aaa.hbs with foo-zone.tab');

            // reads handlebars template
            expect(readFileAsyncStub).toHaveBeenCalledWith(`some-template-path/test-dir/aaa.hbs`, 'utf-8');

            // converts and writes to correct file path
            const fileWritePath = writeFileAsyncStub.calls.first().args[0];
            const jsonString = writeFileAsyncStub.calls.first().args[1].toString();

            const expectedJSON = {
                numberOfZones: 1,
                zones: [
                    {
                        countryCodes: ["AU", "EU"],
                        timezone: "Australia/Sydney"
                    }
                ]
            };
            expect(fileWritePath).toEqual('saveDirFoo/test-dir/sample-data-1-foo-zone-aaa.json');
            expect(JSON.parse(jsonString)).toEqual(expectedJSON);
        });

        it('should throw an error and write an error file when the JSON created by the handlebars template is invalid', async() => {

            const writeFileAsyncStub = jasmine
                .createSpy('writeFileAsyncSpy');

            const readFileAsyncStub = jasmine
                .createSpy('readFileAsyncSpy')
                .and.returnValue(readFileAsync(path.join(__dirname, './invalid-test-template.hbs'), 'utf-8'));

            const logSpy = jasmine.createSpy('console.log');

            let error: Error | null = null;
            try {
                await createJSONFromHandlebarsTemplates(
                    params,
                    writeFileAsyncStub,
                    readFileAsyncStub,
                    logSpy
                );
            } catch(e){
                error = e;
            }

            expect(error!.message).toContain(`
                Could not parse JSON please check your templates.
                See timezones/error.txt 
                Error: SyntaxError: Unexpected token } in JSON at position 157`);

            // writes bade json file to correct error file path
            const fileWritePath = writeFileAsyncStub.calls.first().args[0];
            const jsonString = writeFileAsyncStub.calls.first().args[1].toString();

            expect(fileWritePath).toEqual('saveDirFoo/error.txt');

            // the comma on timezone should not be there
            const expectedErrorText = `{
                "firstCountryCode": "AU",
                "timezone": "Australia/Sydney",
            }`;

            expect(jsonString).toContain(expectedErrorText);
        });

        it('should throw an error if it cannot write the error file', async() => {

            const writeFileAsyncStub = jasmine
                .createSpy('writeFileAsyncSpy')
                .and.callFake(() => {
                    return new Promise((resolve, reject) =>  reject(new Error("cannot write foo")))
                });


            const readFileAsyncStub = jasmine
                .createSpy('readFileAsyncSpy')
                .and.returnValue(readFileAsync(path.join(__dirname, './invalid-test-template.hbs'), 'utf-8'));

            const logSpy = jasmine.createSpy('console.log');

            let error: Error | null = null;
            try {
                await createJSONFromHandlebarsTemplates(
                    params,
                    writeFileAsyncStub,
                    readFileAsyncStub,
                    logSpy
                );
            } catch(e){
                error = e; //?
            }

            expect(error!.message.toString()).toContain('Could not write error file:');
            expect(error!.message.toString()).toContain('Trying to write to path: saveDirFoo/error.txt');
        })
    })
});


