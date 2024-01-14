import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { todosApi } from '@/services/todos';

export function createStore() {
  const store = configureStore({
    reducer: {
      [todosApi.reducerPath]: todosApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(todosApi.middleware),
  });

  setupListeners(store.dispatch);

  return store;
}

export type Store = ReturnType<typeof createStore>;
export type State = ReturnType<Store['getState']>;
