// src/pages/TryItOut.js
import React from 'react';
import Layout from '@theme/Layout';

function Demo() {
  return (
    <Layout title="Demo App using the API" description="App that shows how to use the API">
      <div style={{ width: '100%', height: '80vh', border: 'none' }}>
        <iframe
          src="https://thatapicompany.retool.com/p/overture-maps-api" // Replace with your remote URL
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Demo App using the API"
        />
      </div>
    </Layout>
  );
}

export default Demo