import React from 'react';
import { AppProps } from 'next/app';

import '../styles/index.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <article className="prose lg:prose-xl">
      <Component {...pageProps} />
    </article>
  );
}

export default MyApp;
