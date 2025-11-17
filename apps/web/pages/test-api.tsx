import { useState } from 'react';
import Head from 'next/head';

export default function TestAPI() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('music');

  const testAPI = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch(`/api/test-youtube?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: true, message: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>YouTube API Test - Mittai's Music</title>
      </Head>
      
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'monospace' }}>
        <h1 style={{ color: '#1db954' }}>YouTube API Test</h1>
        
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter search query"
            style={{
              padding: '10px',
              width: '300px',
              marginRight: '10px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
          <button
            onClick={testAPI}
            disabled={loading}
            style={{
              padding: '10px 20px',
              background: '#1db954',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {loading ? 'Testing...' : 'Test API'}
          </button>
        </div>

        {result && (
          <div style={{
            background: result.error ? '#ffebee' : '#e8f5e9',
            padding: '20px',
            borderRadius: '8px',
            marginTop: '20px'
          }}>
            <h3 style={{ marginTop: 0, color: result.error ? '#c62828' : '#2e7d32' }}>
              {result.error ? '❌ Error' : '✅ Success'}
            </h3>
            <pre style={{
              background: '#f5f5f5',
              padding: '15px',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '12px'
            }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div style={{ marginTop: '40px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
          <h3>Instructions:</h3>
          <ol>
            <li>Enter a search query (e.g., "music", "songs", "taylor swift")</li>
            <li>Click "Test API" to check if YouTube API is working</li>
            <li>Check the result below</li>
          </ol>
          
          <h4 style={{ marginTop: '20px' }}>Common Issues:</h4>
          <ul>
            <li><strong>403 Forbidden:</strong> API key is invalid or has no quota</li>
            <li><strong>400 Bad Request:</strong> Invalid parameters</li>
            <li><strong>429 Too Many Requests:</strong> Quota exceeded</li>
          </ul>
          
          <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
            <strong>Note:</strong> The API key is configured in <code>.env.local</code>
          </p>
        </div>
      </div>
    </>
  );
}
