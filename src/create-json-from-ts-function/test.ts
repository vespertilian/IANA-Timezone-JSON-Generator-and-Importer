import {FileToBeCreated, IExtractedTimezoneData} from '../types-for-ts-templates';

export function createFiles(extractedTimezoneData: IExtractedTimezoneData): FileToBeCreated[] {
    const fileA = {fileName: 'file-a', json: JSON.stringify({a: extractedTimezoneData.numberOfZones})};
    const fileB = {fileName: 'file-b', json: JSON.stringify({b: extractedTimezoneData.version})};
    return [fileA, fileB]
}
