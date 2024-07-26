import { findServer } from './findServer';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('findServer', () => {
  it('should return the server with the lowest priority that is online', async () => {
    mockedAxios.get.mockResolvedValueOnce({ status: 200 }); // gitlab.com online
    mockedAxios.get.mockResolvedValueOnce({ status: 500 }); // perfume.new offline
    mockedAxios.get.mockResolvedValueOnce({ status: 200 }); // scnt.me online
    mockedAxios.get.mockResolvedValueOnce({ status: 404 }); // scentronix.com offline

    const server = await findServer();
    expect(server.url).toBe('http://app.scnt.me');
  });

  it('should throw an error if no servers are online', async () => {
    mockedAxios.get.mockResolvedValueOnce({ status: 500 }); // perfume.new offline
    mockedAxios.get.mockResolvedValueOnce({ status: 500 }); // gitlab.com offline
    mockedAxios.get.mockResolvedValueOnce({ status: 404 }); // scnt.me offline
    mockedAxios.get.mockResolvedValueOnce({ status: 404 }); // scentronix.com offline

    await expect(findServer()).rejects.toThrow('No servers are online');
  });
});
