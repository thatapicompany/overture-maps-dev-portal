// src/pages/EmbedPage.js
import React from 'react';
import Layout from '@theme/Layout';

function EmbedPage() {
  return (
    <Layout title="Embedded Page" description="This page embeds an external URL">
      <div style={{ width: '100%', height: '80vh', border: 'none' }}>
        <iframe
          src="https://overture-maps-api.thatapicompany.com/api-docs" // Replace with your remote URL
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Embedded Content"
        />
      </div>
    </Layout>
  );
}

export default EmbedPage;