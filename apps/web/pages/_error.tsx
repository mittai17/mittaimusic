import { NextPageContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';

interface ErrorProps {
  statusCode?: number;
}

function Error({ statusCode }: ErrorProps) {
  return (
    <>
      <Head>
        <title>{statusCode ? `Error ${statusCode}` : 'Error'} - Mittai's Music</title>
      </Head>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
        color: 'white',
        fontFamily: 'Inter, sans-serif',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div>
          <h1 style={{
            fontSize: '6rem',
            margin: '0',
            background: 'linear-gradient(135deg, #ffffff 0%, #1db954 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {statusCode || '😕'}
          </h1>
          <h2 style={{ fontSize: '2rem', marginTop: '20px', marginBottom: '10px' }}>
            {statusCode
              ? `An error ${statusCode} occurred on server`
              : 'An error occurred on client'}
          </h2>
          <p style={{ color: '#b3b3b3', fontSize: '1.1rem', marginBottom: '30px' }}>
            Something went wrong. Let's get you back on track.
          </p>
          <Link 
            href="/"
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              background: '#1db954',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            🏠 Go Home
          </Link>
        </div>
      </div>
    </>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
