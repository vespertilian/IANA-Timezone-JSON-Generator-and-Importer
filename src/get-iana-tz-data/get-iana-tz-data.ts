//@ts-ignore
import * as decompressTargz from 'decompress-targz';
import fetch from 'node-fetch';
import {replaceLineBreaks} from '../util/util';

export interface getIANATzDataParams {
    url: string
    filesToExtract: string[]
    fileEncoding: string
}

interface IANAFileResult {
    data: Buffer
    mode: number
    mtime: Date
    path: string
    type: string
}

export interface IANATzDataFiles {
    version: string
    [key: string]: string
}

export async function getIANATzData(params?: getIANATzDataParams, _fetch=fetch): Promise<IANATzDataFiles> {
    const defults: getIANATzDataParams =  {
        url: 'https://www.iana.org/time-zones/repository/tzdata-latest.tar.gz',
        filesToExtract: ['zone.tab', 'zone1970.tab'],
        fileEncoding: 'utf8'
    };

    const {url, filesToExtract, fileEncoding} = Object.assign(defults, params);

    const result = await _fetch(url);
    if(!result.ok) {
        throw new Error(`Fetch failed: ${result.status}`)
    }
    const buffer = await result.buffer();
    const decompressed: IANAFileResult[] = await decompressTargz()(buffer);

    const IANATzDataFiles: IANATzDataFiles = decompressed.reduce((acc: IANATzDataFiles, file) => {
        const fileName = file.path;
        if(filesToExtract.includes(fileName) || fileName === 'version') {
            const document = file.data.toString(fileEncoding);
            acc[fileName] = document
        }
        return acc
    }, {version: 'no version file found'});

    // replace line break so they don't show up in the handlebars template and break JSON parsing
    IANATzDataFiles.version = replaceLineBreaks(IANATzDataFiles.version);
    return IANATzDataFiles
}

