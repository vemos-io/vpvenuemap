// netlify/functions/get-config.js
// This function securely provides the Mapbox token from environment variables

exports.handler = async function(event, context) {
  // Set CORS headers to allow requests from your domain
  const headers = {
    'Access-Control-Allow-Origin': '*', // In production, replace with your domain
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Get Mapbox token from environment variable
  const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;

  if (!mapboxToken) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Mapbox token not configured. Please add MAPBOX_ACCESS_TOKEN to your environment variables.' 
      })
    };
  }

  // Return the token
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      mapboxToken: mapboxToken
    })
  };
};
