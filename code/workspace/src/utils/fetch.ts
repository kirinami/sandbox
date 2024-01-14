export type Endpoint = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  handler: (req: Record<'params' | 'query' | 'body', Record<string, string>>) => unknown;
};

export const fetch = async (
  input: RequestInfo | string,
  init?: RequestInit | undefined,
  endpoints: Endpoint[] = [],
): Promise<Response> => {
  input = typeof input === 'string' ? new Request(input) : input;

  const url = new URL(input.url);
  const method = input.method.toUpperCase();

  const regexp = (url: string) => new RegExp(`${url.replace(/:(\w+)/g, '(?<$1>.+)')}$`);

  const endpoint = endpoints.find(
    (endpoint) => regexp(endpoint.url).test(url.pathname) && (endpoint.method || 'GET') === method,
  );

  console.log(method, url.href, endpoint ? '(fake)' : '(real)');

  if (!endpoint) {
    return globalThis.fetch(input, init);
  }

  await new Promise<void>((resolve) => {
    setTimeout(() => resolve(), Math.floor(100 + Math.random() * 600));
  });

  const params: Record<string, string> = regexp(endpoint.url).exec(url.pathname)?.groups || {};
  const query: Record<string, string> = {};
  const body: Record<string, string> = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
    ? await input.json().catch(() => ({}))
    : {};

  url.searchParams.forEach((value, key) => {
    query[key] = value;
  });

  const data = await endpoint.handler({
    params,
    query,
    body,
  });

  if (data === undefined) {
    throw new Error('Not Found');
  }

  return new Response(JSON.stringify(data), {
    status: 200,
  });
};
