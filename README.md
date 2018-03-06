# IANA Timezone Generator

Quickly get data from the IANA website into your application.

### Generate JSON files from IANA data

Generate timezone JSON files using Handlebar templates.

This allows you to quickly and easily format the data to look exactly how you want it to.

Please feel free to share your TZ shape by adding your own template via a pull request.

*Run: `ts-node src/create-tz-data-from-templates.ts`*

#### From this

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
{{!-- see project readme for data shape --}}
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
        }
    ]
}
```

### Get IANA timezone data

Load a string version of any IANA timezone data file from the IANA website with `get-iana-tz-data`. Defaults include zone.tab and zone1970.tab.

### Extract IANA timezone data

Extract the latest IANA timezone data from the IANA website using `extract-timezone-data` return as a JS object with Typescript typings.




