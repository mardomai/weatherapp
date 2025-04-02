import { SessionProvider } from 'next-auth/react';
import '../app/globals.css';
import Header from '../app/components/Header';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp; 