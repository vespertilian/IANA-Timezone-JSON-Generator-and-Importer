import {createJSONFromHandlebarsTemplatesAndZoneData} from './create-json-from-handlebars-templates';

describe('create-json-from-handlebars-template', () => {
    describe('.createJSONFromHandlebarsTemplatesAndZoneData', () => {
        it('should call .createJSONFromHandlebarsTemplates with default parameters after loading files and zone data', async() => {
            const getIANATzDataSpy = jasmine.createSpy('getIANATzData');
            const createJSONFromHandlebarsTemplatesSpy = jasmine.createSpy('createJSONFromHandlebarsTemplates');
            const readdirAsyncSpy = jasmine.createSpy('readdirAsync');

            await createJSONFromHandlebarsTemplatesAndZoneData({} as any, getIANATzDataSpy, createJSONFromHandlebarsTemplatesSpy, readdirAsyncSpy)
        })
    })
});