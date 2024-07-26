import axios from 'axios';

interface Server {
  url: string;
  priority: number;
}

const servers: Server[] = [
  { url: 'https://does-not-work.perfume.new', priority: 1 },
  { url: 'https://gitlab.com', priority: 4 },
  { url: 'http://app.scnt.me', priority: 3 },
  { url: 'https://offline.scentronix.com', priority: 2 }
];

async function findServer(): Promise<Server> {
  const requests = servers.map(server =>
    axios.get(server.url, { timeout: 5000 })
      .then(response => response.status >= 200 && response.status < 300 ? server : null)
      .catch(() => null)
  );

  const results = await Promise.all(requests);
  const onlineServers = results.filter(server => server !== null) as Server[];

  if (onlineServers.length === 0) {
    throw new Error('No servers are online');
  }

  onlineServers.sort((a, b) => a.priority - b.priority);
  return onlineServers[0];
}

export { findServer, Server };
