const getToken = () => localStorage.getItem('auth_token');

interface IApi {
  get: <T>(endpoint: string) => Promise<T>;
  post: <T>(endpoint: string, data: unknown) => Promise<T>;
  patch: <T>(endpoint: string, data: unknown) => Promise<T>;
  delete: <T>(endpoint: string) => Promise<T>;
}

function internalFetch<T>(endpoint: string, data?: unknown): Promise<T> {
  return fetch(endpoint, data).then(async (response) => {
    if (response.ok) {
      return await response.json() as Promise<T>;
    }
    const errorMessage = await response.text();
    return Promise.reject(new Error(errorMessage));
  });
}

function api(): IApi {
  const host = process.env.API_HOST;
  const token = getToken();
  const headers = {
    authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  return {
    get: (endpoint: string) => internalFetch(
      `${host}${endpoint}`,
      {
        method: 'GET',
        headers,
      },
    ),
    post: (endpoint: string, data: unknown) => internalFetch(
      `${host}${endpoint}`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      },
    ),
    patch: (endpoint: string, data: unknown) => internalFetch(
      `${host}${endpoint}`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
      },
    ),
    delete: (endpoint: string) => internalFetch(
      `${host}${endpoint}`,
      {
        method: 'PATCH',
        headers,
      },
    ),
  };
}

export {
  api,
};
