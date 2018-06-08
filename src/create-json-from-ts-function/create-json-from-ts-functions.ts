import {ICreateJSONFromTemplatesParams} from '../create-json-from-templates-and-zone-data/create-json-from-templates-and-zone-data';
import {ensureExistsAsync, writeFileAsync} from '../util/util';
import * as path from 'path';
import {CreationFile} from '../types-for-ts-templates';

export async function createJsonFromTsFunctions(
    params: ICreateJSONFromTemplatesParams,
    _writeFileAsync=writeFileAsync as any,
    _ensureExistsAsync=ensureExistsAsync as any,
    _log= console.log
) {
    const {templateFileNames, extractedZoneData, templatesPath, zoneFileName, saveDirectory} = params;

    for(const filenamePath of params.templateFileNames) {
        _log(`Creating JSON for: ${filenamePath} with ${zoneFileName}`);
        const fullFilePath = `${params.templatesPath}/${filenamePath}`;
        const fullFilePathWithoutExtension = fullFilePath.slice(0, fullFilePath.lastIndexOf('.'));

        const creationFile: CreationFile = await import(fullFilePathWithoutExtension);

        const filesToBeCreated = creationFile.createFiles(params.extractedZoneData);

        const endFilePosition = filenamePath.lastIndexOf('/');

        // i.e saveDirFoo/test-dir
        const savePath =
            (endFilePosition > 0) ? // maybe there is no sub-directory
                `${saveDirectory}/${filenamePath.slice(0, endFilePosition)}`:
                saveDirectory;

        const zoneFilenameSansTab = zoneFileName.replace('.tab', '');

        for(const file of filesToBeCreated) {
            const writeFileName = `${extractedZoneData.version}-${zoneFilenameSansTab}-${file.fileName}.json`
            const writePath = path.join(savePath, writeFileName);
            await _ensureExistsAsync(savePath);
            await _writeFileAsync(writePath, file.json)
        }
    }
}

