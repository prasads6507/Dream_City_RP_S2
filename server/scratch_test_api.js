const axios = require('axios');

async function testFetch() {
  const SERVER_ID = '4gblo45';
  try {
    console.log(`Fetching status for ${SERVER_ID}...`);
    const response = await axios.get(`https://servers-v2.cfx.re/api/servers/single/${SERVER_ID}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 5000
    });
    console.log('Success!');
    console.log('Clients:', response.data.Data.clients);
    console.log('Hostname:', response.data.Data.hostname);
  } catch (error) {
    console.error('Failed to fetch from Cfx.re API:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testFetch();
