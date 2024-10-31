const axios = require('axios')



async function getProfile(accessToken) {
    
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
  
    const data = await response.json();
    return data;
}
  

module.exports = getProfile