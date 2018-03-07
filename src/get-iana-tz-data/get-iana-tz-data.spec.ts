import {getIANATzData, getIANATzDataParams} from './get-iana-tz-data';
import {readFileAsync} from '../util/util';
import * as path from 'path';

describe('get-iana-tz-data.spec.ts', () => {
    it('should call fetch with default params when none are passed in', async() => {
        const fetchMock = createFetchMock();
        const result = await getIANATzData({} as getIANATzDataParams, fetchMock);

        expect(fetchMock).toHaveBeenCalledWith('https://www.iana.org/time-zones/repository/tzdata-latest.tar.gz');
        expect(result.version).toEqual('2018c');
        expect(result['zone.tab']).toBeTruthy();
        expect(result['zone1970.tab']).toBeTruthy();
    });

    it('should allow you to request other files and set a different url', async() => {
        const fetchMock = createFetchMock();
        const result = await getIANATzData({
            url: 'http://foo.com',
            filesToExtract: ['zone.tab'],
            fileEncoding: 'utf8'
        }, fetchMock);

        expect(fetchMock).toHaveBeenCalledWith('http://foo.com');
        expect(result.version).toEqual('2018c');
        expect(result['zone.tab']).toBeTruthy();
        expect(result['zone1970.tab']).toBeFalsy();
    });

    it('should throw an error if the fetch fails', async() => {
        const fetchMock = jasmine.createSpy('fetch');

        fetchMock.and.returnValue({
            ok: false,
            status: 'foo status'
        });

        let error = null;
        try {
            await getIANATzData({} as getIANATzDataParams, fetchMock);
        } catch (e) {
            error = e;
        }

        expect(error.message).toEqual(`Fetch failed: foo status`)
    })
});

function createFetchMock() {
    const fetchMock = jasmine.createSpy('fetch');

    fetchMock.and.returnValue({
        ok: true,
        buffer: testDataFileBuffer
    });
    return fetchMock;
}

async function testDataFileBuffer() {
    const filePath = path.join(__dirname, 'tzdata.tar.gz');
    return readFileAsync(filePath);
}

