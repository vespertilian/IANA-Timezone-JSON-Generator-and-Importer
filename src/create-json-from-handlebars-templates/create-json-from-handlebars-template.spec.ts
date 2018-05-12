import {
    createJSONFromHandlebarsTemplates,
    createJSONFromHandlebarsTemplatesAndZoneData,
    ICreateJSONFromHandlebarsTemplatesParams
} from './create-json-from-handlebars-templates';
import * as path from 'path';
import {ensureExistsAsync, readFileAsync} from '../util/util';
import {IANATzDataFiles} from '../get-iana-tz-data/get-iana-tz-data';
import {sampleExtractedData} from './test-extracted-data';

describe('create-json-from-handlebars-template', () => {
    describe('.createJSONFromHandlebarsTemplatesAndZoneData', () => {
        it('should call .createJSONFromHandlebarsTemplates with default parameters and get files and zone data', async() => {
            const createJSONFromHandlebarsTemplatesSpy = jasmine
                .createSpy('createJSONFromHandlebarsTemplates');

            const getIANATzDataStub = jasmine.createSpy('getIANATzDataSpy')
                .and.returnValue(fakeIANAData());

            await createJSONFromHandlebarsTemplatesAndZoneData(
                {} as any, // will use default settings
                getIANATzDataStub,
                createJSONFromHandlebarsTemplatesSpy,
            );

            // check default params
            expect(createJSONFromHandlebarsTemplatesSpy).toHaveBeenCalledTimes(2);
            const firstCallParams: ICreateJSONFromHandlebarsTemplatesParams =
                createJSONFromHandlebarsTemplatesSpy.calls.argsFor(0)[0];

            expect(firstCallParams.handlebarsTemplateFileNames).toContain('all-fields-v2.hbs');
            expect(firstCallParams.extractedZoneData.zones[0].countryCodes[0]).toEqual('AD');
            expect(firstCallParams.templatesPath).toContain('templates');
            expect(firstCallParams.zoneFileName).toContain('zone1970.tab');
            expect(firstCallParams.saveDirectory).toContain('timezones');
        });

        it('should call .createJSONFromHandlebarsTemplates with custom parameters and get files and zone data', async() => {
            const createJSONFromHandlebarsTemplatesSpy = jasmine
                .createSpy('createJSONFromHandlebarsTemplates');

            const getIANATzDataStub = jasmine.createSpy('getIANATzDataSpy');

            const extractTzDataSpy = jasmine.createSpy('extractTzData')
                .and.returnValue(new Promise((resolve, reject) => {
                    resolve({foo: 'bar'})
                }));

            const walkAsyncSpy = jasmine
                .createSpy('walkAsyncSpy')
                .and.returnValue(new Promise((resolve, reject) => { resolve(['foo.hbs']) }));

            await createJSONFromHandlebarsTemplatesAndZoneData(
                {
                    templatesPath: 'fooTemplates',
                    saveDirectory: 'fooSaveDirectory',
                    zoneFileNames: ['foo.bar']
                } as any, // settings
                getIANATzDataStub,
                createJSONFromHandlebarsTemplatesSpy,
                extractTzDataSpy,
                walkAsyncSpy
            );

            expect(getIANATzDataStub).toHaveBeenCalledWith({filesToExtract: ['foo.bar']});

            // check default params
            expect(createJSONFromHandlebarsTemplatesSpy).toHaveBeenCalledTimes(1);
            const firstCallParams: ICreateJSONFromHandlebarsTemplatesParams =
                createJSONFromHandlebarsTemplatesSpy.calls.argsFor(0)[0];

            expect(firstCallParams.handlebarsTemplateFileNames).toEqual(['foo.hbs']);
            expect(firstCallParams.extractedZoneData).toEqual({foo: 'bar'} as any);
            expect(firstCallParams.templatesPath).toEqual('fooTemplates');
            expect(firstCallParams.zoneFileName).toEqual('foo.bar');
            expect(firstCallParams.saveDirectory).toEqual('fooSaveDirectory');
        });

        it('should filter the templates path to only use .hbs (handlebars) files', async() => {
            const createJSONFromHandlebarsTemplatesSpy = jasmine.createSpy('createJSONFromHandlebarsTemplates');
            const getIANATzDataStub = jasmine.createSpy('getIANATzDataSpy');
            const extractTzDataSpy = jasmine.createSpy('extractTzData');

            const walkAsyncSpy = jasmine
                .createSpy('walkAsyncSpy')
                .and.returnValue(new Promise((resolve, reject) => { resolve(['foo.hbs', 'bar.json', 'baz.hbs']) }));

            await createJSONFromHandlebarsTemplatesAndZoneData(
                {} as any, // settings
                getIANATzDataStub,
                createJSONFromHandlebarsTemplatesSpy,
                extractTzDataSpy,
                walkAsyncSpy
            );

            const firstCallParams: ICreateJSONFromHandlebarsTemplatesParams =
                createJSONFromHandlebarsTemplatesSpy.calls.argsFor(0)[0];

            expect(firstCallParams.handlebarsTemplateFileNames).toEqual(['foo.hbs', 'baz.hbs']);
        })
    });

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

async function fakeIANAData(): Promise<IANATzDataFiles> {
    const zone1970path = path.join(__dirname, 'test-zone1970.tab');
    const zone1970tab = await readFileAsync(zone1970path);
    const zonePath = path.join(__dirname, 'test-zone.tab');
    const zoneTab = await readFileAsync(zonePath);

    return {
        version: 'TEST',
        ['zone1970.tab']: zone1970tab.toString(),
        ['zone.tab']: zoneTab.toString()
    }
}

