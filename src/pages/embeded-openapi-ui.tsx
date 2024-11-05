// src/pages/EmbedPage.js
import React from 'react';
import Layout from '@theme/Layout';

function EmbedPage() {
  return (
    <Layout title="Embedded OpenAPI UI" description="Embeds the OpenAPI UI directly from the API">
      <div style={{ width: '100%', height: '80vh', border: 'none' }}>
        <iframe
          src="https://overture-maps-api.thatapicompany.com/api-docs" // Replace with your remote URL
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Embedded OpenAPI UI"
        />
      </div>
    </Layout>
  );
}

export default EmbedPage;