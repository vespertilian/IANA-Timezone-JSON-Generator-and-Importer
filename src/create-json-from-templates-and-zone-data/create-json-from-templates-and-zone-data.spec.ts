import {IANATzDataFiles} from '../get-iana-tz-data/get-iana-tz-data';
import * as path from 'path';
import {readFileAsync} from '../util/util';
import {
    createJSONFromTemplatesAndZoneData,
    ICreateJSONFromTemplatesParams
} from './create-json-from-templates-and-zone-data';


describe('.createJSONFromTemplatesAndZoneData', () => {
    it('should call .createJSONFromHandlebarsTemplates with default parameters and get files and zone data', async() => {
        const createJSONFromHandlebarsTemplatesSpy = jasmine
            .createSpy('createJSONFromHandlebarsTemplates');

        const createJSONFromTsFunctionSpy = jasmine
            .createSpy('createJSONFromHandlebarsTemplates');

        const getIANATzDataStub = jasmine.createSpy('getIANATzDataSpy')
            .and.returnValue(fakeIANAData());

        await createJSONFromTemplatesAndZoneData(
            {} as any, // will use default settings
            getIANATzDataStub,
            createJSONFromHandlebarsTemplatesSpy,
            createJSONFromTsFunctionSpy
        );

        // TODO update test to check createJSONFromTsFunctionSpy
        // check default params
        expect(createJSONFromHandlebarsTemplatesSpy).toHaveBeenCalledTimes(1);
        const firstCallParams: ICreateJSONFromTemplatesParams =
            createJSONFromHandlebarsTemplatesSpy.calls.argsFor(0)[0];

        expect(firstCallParams.templateFileNames).toContain('all-fields/all-fields-v2.hbs');
        expect(firstCallParams.extractedZoneData.zones[0].countryCodes[0]).toEqual('AD');
        expect(firstCallParams.templatesPath).toContain('templates');
        expect(firstCallParams.zoneFileName).toContain('zone1970.tab');
        expect(firstCallParams.saveDirectory).toContain('timezones');
    });

    it('should call .createJSONFromHandlebarsTemplates with custom parameters and get files and zone data', async() => {
        const createJSONFromHandlebarsTemplatesSpy = jasmine
            .createSpy('createJSONFromHandlebarsTemplates');
        const createJSONFromTsFunctionSpy = jasmine
            .createSpy('createJSONFromHandlebarsTemplates');

        const getIANATzDataStub = jasmine.createSpy('getIANATzDataSpy');

        const extractTzDataSpy = jasmine.createSpy('extractTzData')
            .and.returnValue(new Promise((resolve, reject) => {
                resolve({foo: 'bar'})
            }));

        const walkAsyncSpy = jasmine
            .createSpy('walkAsyncSpy')
            .and.returnValue(new Promise((resolve, reject) => { resolve(['foo.hbs']) }));

        await createJSONFromTemplatesAndZoneData(
            {
                templatesPath: 'fooTemplates',
                saveDirectory: 'fooSaveDirectory',
                zoneFileNames: ['foo.bar']
            } as any, // settings
            getIANATzDataStub,
            createJSONFromHandlebarsTemplatesSpy,
            createJSONFromTsFunctionSpy,
            extractTzDataSpy,
            walkAsyncSpy
        );

        expect(getIANATzDataStub).toHaveBeenCalledWith({filesToExtract: ['foo.bar']});

        // check default params
        expect(createJSONFromHandlebarsTemplatesSpy).toHaveBeenCalledTimes(1);
        const firstCallParams: ICreateJSONFromTemplatesParams =
            createJSONFromHandlebarsTemplatesSpy.calls.argsFor(0)[0];

        expect(firstCallParams.templateFileNames).toEqual(['foo.hbs']);
        expect(firstCallParams.extractedZoneData).toEqual({foo: 'bar'} as any);
        expect(firstCallParams.templatesPath).toEqual('fooTemplates');
        expect(firstCallParams.zoneFileName).toEqual('foo.bar');
        expect(firstCallParams.saveDirectory).toEqual('fooSaveDirectory');
    });

    it('should filter the templates path to only use .hbs (handlebars) files', async() => {
        const createJSONFromHandlebarsTemplatesSpy = jasmine
            .createSpy('createJSONFromHandlebarsTemplates');
        const createJSONFromTsFunctionSpy = jasmine
            .createSpy('createJSONFromHandlebarsTemplates');
        const getIANATzDataStub = jasmine.createSpy('getIANATzDataSpy');
        const extractTzDataSpy = jasmine.createSpy('extractTzData');

        const walkAsyncSpy = jasmine
            .createSpy('walkAsyncSpy')
            .and.returnValue(new Promise((resolve, reject) => { resolve(['foo.hbs', 'bar.json', 'baz.hbs']) }));

        await createJSONFromTemplatesAndZoneData(
            {} as any, // settings
            getIANATzDataStub,
            createJSONFromHandlebarsTemplatesSpy,
            createJSONFromTsFunctionSpy,
            extractTzDataSpy,
            walkAsyncSpy
        );

        const firstCallParams: ICreateJSONFromTemplatesParams =
            createJSONFromHandlebarsTemplatesSpy.calls.argsFor(0)[0];

        expect(firstCallParams.templateFileNames).toEqual(['foo.hbs', 'baz.hbs']);
    })
});

async function fakeIANAData(): Promise<IANATzDataFiles> {
    const zone1970path = path.join(__dirname, 'test-zone1970.tab'); //?
    const zone1970tab = await readFileAsync(zone1970path);

    return {
        version: 'TEST',
        ['zone1970.tab']: zone1970tab.toString(),
    }
}
