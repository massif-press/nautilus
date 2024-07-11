const invoke = `${(import.meta as any).env.VITE_APP_API_INVOKE}`;

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': (import.meta as any).env.VITE_APP_API_KEY,
  'Access-Control-Request-Headers': 'Content-Type,x-api-key',
};

export const getUser = async (id: string): Promise<any> => {
  const url = new URL(`${invoke}/user`);
  url.searchParams.append('id', id);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data;
};

export async function updateUser(id: string, payload: any): Promise<any> {
  const url = new URL(`${invoke}/user`);
  url.searchParams.append('id', id);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}

export async function updateItem(id: string, payload: any): Promise<any> {
  const url = new URL(`${invoke}/item`);
  url.searchParams.append('id', id);
  url.searchParams.append('itemtype', payload.type);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}

export async function getComments(item_id: string): Promise<any> {
  const url = new URL(`${invoke}/item/comment`);
  url.searchParams.append('item_id', item_id);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data;
}

export async function postComment(payload: any): Promise<any> {
  const url = new URL(`${invoke}/item/comment`);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}

export async function getRequests(): Promise<any> {
  const url = new URL(`${invoke}/meta/permission`);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data;
}

export async function postRequest(user_id: string): Promise<any> {
  const url = new URL(`${invoke}/meta/permission`);
  url.searchParams.append('user_id', user_id);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}

export async function deleteRequest(user_id: string): Promise<any> {
  const url = new URL(`${invoke}/meta/permission`);
  url.searchParams.append('user_id', user_id);

  const response = await fetch(url.toString(), {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}

export async function getImagePresign(key: string): Promise<any> {
  const url = new URL(`${invoke}/meta/image/presign`);
  url.searchParams.append('key', key);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data;
}

export async function postImageMetadata(payload: any): Promise<any> {
  const url = new URL(`${invoke}/meta/image`);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}

export async function getImages(): Promise<any> {
  const url = new URL(`${invoke}/meta/image`);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data;
}
