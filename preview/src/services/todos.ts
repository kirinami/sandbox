import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { fetch } from '@/utils/fetch';

export const todosApi = createApi({
  reducerPath: 'todosApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
    fetchFn: (input, init) => fetch(input, init, []),
  }),
  endpoints: () => ({}),
});
