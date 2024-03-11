import { assert, test} from 'vitest';
import HttpClient from '../Scripts/http';

test('getTransactions should return valid transactions', async () => {
    const expectedTransactions = [
      { trxHash: '123213213', value: '100', blockNumber: 54300 },
      { trxHash: '22222', value: '99.99', blockNumber: 54301 },
    ];
    const apiKey = 'UEVD894TAHT8V6H8P2AVX26ITZ6R1D6XRM';
    const httpClient = new HttpClient(apiKey);
  
    const originalFetch = global.fetch;
    global.fetch = () => ({
      json: () => Promise.resolve({ status: '1', result: expectedTransactions }),
    });
  
  
    const result = await httpClient.getTransactions('testAddress');
  

    assert.deepEqual(result, expectedTransactions);
  

    global.fetch = originalFetch;
  });