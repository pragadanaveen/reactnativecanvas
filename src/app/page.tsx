'use client';

import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import Builder from '@/components/builder/Builder';

export default function Home() {
  return (
    <Provider store={store}>
      <main className="min-h-screen">
        <Builder />
      </main>
    </Provider>
  );
}
