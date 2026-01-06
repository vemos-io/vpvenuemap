// netlify/functions/get-venues.js
// This function securely fetches venues from Vemos API using the API key from environment variables

exports.handler = async function(event, context) {
  // Set CORS headers
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

  // Get Vemos API credentials from environment variables
  const vemosApiKey = process.env.VEMOS_API_KEY;
  const vemosBearerToken = process.env.VEMOS_BEARER_TOKEN;
  const vemosApiUrl = process.env.VEMOS_API_URL || 'https://api-v3.vemos.io/vemospay/venue';

  if (!vemosApiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Vemos API key not configured. Please add VEMOS_API_KEY to your environment variables.' 
      })
    };
  }

  if (!vemosBearerToken) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Vemos Bearer token not configured. Please add VEMOS_BEARER_TOKEN to your environment variables.' 
      })
    };
  }

  try {
    // Fetch venues from Vemos API with both API key and Bearer token
    const response = await fetch(vemosApiUrl, {
      method: 'GET',
      headers: {
        'x-api-key': vemosApiKey,
        'Authorization': `Bearer ${vemosBearerToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Vemos API request failed: ${response.status} ${response.statusText}`);
    }

    const venues = await response.json();

    // Return the venues data
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(venues)
    };

  } catch (error) {
    console.error('Error fetching venues:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch venues from Vemos API',
        message: error.message 
      })
    };
  }
};
