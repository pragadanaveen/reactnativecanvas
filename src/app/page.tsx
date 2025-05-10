'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/editor/store';
import Editor from '@/editor/components/Editor';

export default function Home() {
  return (
    <Provider store={store}>
      <Editor />
    </Provider>
  );
}
