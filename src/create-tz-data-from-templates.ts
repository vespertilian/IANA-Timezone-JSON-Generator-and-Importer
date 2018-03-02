import {getIANATzData} from './get-iana-tz-data';
import {extractTzData} from './extract-tz-data';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars'
import {promisify} from 'util';

async function getAndExtractTzData() {
    const readdirAsync =  promisify(fs.readdir);
    const readFileAsync = promisify(fs.readFile);
    const writeFileAsync = promisify(fs.writeFile);

    const zoneData = await getIANATzData();
    const extractedZoneData = extractTzData(zoneData, 'zone.tab');

    const templatePath = path.join(__dirname, '..', 'templates');
    const files = await readdirAsync(templatePath);

    files.forEach(async (filename) => {
        const filePath = `${templatePath}/${filename}`;
        const hbsFile = await readFileAsync(filePath, 'utf-8');

        const hbsTemplate = Handlebars.compile(hbsFile);

        const output = hbsTemplate({
            zones: extractedZoneData.zones,
            numberOfZones: extractedZoneData.numberOfZones,
            ianaVersion: zoneData.version
        });

        try {
            // parseJSON to make sure it is valid!
            const parsedJSON = JSON.parse(output);

            // create filename and path
            const writeFileName = filename.replace('.hbs', '.json');
            const writePath = path.join(__dirname, '..', 'timezones', writeFileName);

            console.log(writeFileName)

            // turn json into pretty string and write file
            const jsonString = JSON.stringify(parsedJSON, null, 4);
            await writeFileAsync(writePath, jsonString);

        } catch(e) {
            const errorPath = path.join(__dirname, '..', 'timezones', 'error.txt');

            try {
                await writeFileAsync(errorPath, output);
            } catch(e) {
               throw new Error(`
                Could not write error file: ${e}
               `)
            }

            throw new Error(`
                Could not parse JSON please check your templates.
                See timezones/error.txt 
                Error: ${e}
            `)
        }
    })
}

try {
    getAndExtractTzData();
} catch(e) {
    console.log(e);
}


