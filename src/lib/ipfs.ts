const PINATA_JWT = process.env.PINATA_JWT;
const PINATA_GATEWAY = process.env.PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';

export async function add(data: string | object): Promise<string> {
  const json = typeof data === 'string' ? data : JSON.stringify(data);
  const blob = new Blob([json], { type: 'application/json' });

  const formData = new FormData();
  formData.append('file', blob, 'data.json');

  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Pinata upload failed: ${error}`);
  }

  const result = await response.json();
  return result.IpfsHash;
}

export async function addJSON(data: object): Promise<string> {
  const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Pinata JSON upload failed: ${error}`);
  }

  const result = await response.json();
  return result.IpfsHash;
}

export async function get(cid: string): Promise<string> {
  const response = await fetch(`${PINATA_GATEWAY}${cid}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
  }
  return response.text();
}

export async function getJSON<T>(cid: string): Promise<T> {
  const text = await get(cid);
  return JSON.parse(text);
}

export function getGatewayUrl(cid: string): string {
  return `${PINATA_GATEWAY}${cid}`;
}

export async function pinByHash(cid: string): Promise<void> {
  const response = await fetch('https://api.pinata.cloud/pinning/pinByHash', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ hashToPin: cid }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Pinata pin by hash failed: ${error}`);
  }
}

export async function unpin(cid: string): Promise<void> {
  const response = await fetch(`https://api.pinata.cloud/pinning/unpin/${cid}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Pinata unpin failed: ${error}`);
  }
}

export async function listPins(options?: {
  status?: 'pinned' | 'unpinned' | 'pinning' | 'failed';
  pageLimit?: number;
  pageOffset?: number;
}): Promise<any[]> {
  const params = new URLSearchParams();
  if (options?.status) params.append('status', options.status);
  if (options?.pageLimit) params.append('pageLimit', options.pageLimit.toString());
  if (options?.pageOffset) params.append('pageOffset', options.pageOffset.toString());

  const response = await fetch(`https://api.pinata.cloud/data/pinList?${params}`, {
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Pinata list failed: ${error}`);
  }

  const result = await response.json();
  return result.rows;
}