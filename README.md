# IANA Timezone JSON Generator and Importer

Quickly get timezone names and metadata from the IANA into your application in the format you want.

Written in Typescript so you can import the shape of the data and get awesome type completion.

100% test coverage using [Jasmine](https://github.com/jasmine/jasmine) and [WallabyJS](https://wallabyjs.com/)

A large part of this codebase is using or was inspired by packages created by [shinnn](https://www.npmjs.com/~shinnn). Using handlebars templates to quickly create custom JSON shapes inspired by this project [Graphql Code Generator](https://medium.com/@dotansimha/graphql-code-generator-a34e3785e6fb)

## Quickly load an existing json file into your application

#### NPM Install

`npm install iana-tz-json-generator-and-importer`

#### Find the JSON file you want to import

See ./timezones for currently available timezones
Timezones are named after the IANA version and file used in generation

`{version}-{IANAFileName}-{handlebarsTemplateName}.json`

#### Import into your app (with typings if you use Typescript)

```typescript
import {loadIANATzJsonFile} from 'iana-tz-json-generator-and-importer';
import {IAllFields} from 'iana-tz-json-generator-and-importer/timezones/all-fields';
async function loadAllFields() {
  const allFields = await loadIANATzJsonFile('2018c-zone1970-all-fields.json');
  const values: IAllFields = JSON.parse(allFields);
}
```

## Generate your own custom JSON files from IANA data

Generate timezone JSON files using Handlebar templates.

This allows you to quickly and easily format the data exactly how you want it to.

#### Steps

- `clone the package`
- `npm install`
- Add your own custom handlebars template to the `./template` folder
- Add typescript typings in the `./template` folder
- npm run generate-json-files-and-typescript-types
- submit pull request

#### From this

*./templates/all-fields.hbs*

```handlebars
{{!-- handlebars inline partial --}}
{{#*inline "coordinates"}}
{
    "sign": "{{sign}}",
    "degree": {{degree}}, {{!-- no commar here if second does not exist--}}
    "minute": {{minute}}{{#if second}},{{/if}}
    {{!-- dont output second if it does not exist --}}
    {{#if second}}"second": {{second}}{{/if}}
}
{{/inline}}

{{!-- create json file --}}
{
    "IANAVersion": "{{ianaVersion}}",
    "numberOfZones": {{numberOfZones}},
    "zones": [
        {{#each zones}}
            {
                "countryCode": "{{countryCode}}",
                "timezone": "{{timezoneName}}",
                "coordinates": {
                    "latitude": {{> coordinates coordinates.latitude}}
                    "longitude": {{> coordinates coordinates.longitude}}
                }
            }{{#unless @last}},{{/unless}}
        {{/each}}
    ]
}
```

*./templates/all-fields.ts* typings for the JSON shape.

```typescript
export interface IAllFields {
    IANAVersion: string
    numberOfZones: number
    zones: IZones[]
}

export interface IZones {
    countryCode: string
    timezone: string
    coordinates: {
        latitude: ICoordinate,
        longitude: ICoordinate
    }
}

export interface ICoordinate {
    sign: string
    degree: number
    minute: number
    second?: number
}
```

#### To this

```JSON
{
    "IANAVersion": "2018c",
    "numberOfZones": 424,
    "zones": [
        {
            "countryCode": "AD",
            "timezone": "Europe/Andorra",
            "coordinates": {
                "latitude": {
                    "sign": "+",
                    "degree": 42,
                    "minute": 30
                },
                "longitude": {
                    "sign": "+",
                    "degree": 1,
                    "minute": 31
                }
            }
        },
        ...
    ]
}
```

#### You can also call the function and output the json to a directory you choose

- `npm install iana-tz-json-generator-and-importer`
- call: `createJSONFromTemplatesAndZoneData({
       templatesPath: string,
       saveDirectory: string,
       zoneFileNames: string[]
   })`

## Other functions

### Get IANA timezone data

Load a string version of any IANA timezone data file from the IANA website with `get-iana-tz-data`. Defaults include zone.tab and zone1970.tab.

### Extract IANA timezone data

Extract the latest IANA timezone data from the IANA website using `extract-timezone-data` return as a JS object with Typescript typings.

## Workflow

1. Make changes
2. Commit those changes `npm run commit`
3. Test `npm run test`
4. Bump version in `package.json`
5. Generate changelog `npm run generate-changelog`
6. Commit `package.json` and `CHANGELOG.md` files
7. Run npm `publish`
8. Git tag - needed by changelog to know what version to attribute the commits to
9. Push
