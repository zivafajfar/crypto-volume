const express = require('express');
const axios = require('axios');

// Constants
//const PORT = 8080;
//const HOST = '0.0.0.0';
const PORT = process.env.PORT || 3000;

// App
const app = express();


let response = null;
new Promise(async (resolve, reject) => {
  try {
    response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?volume_24h_min=10000000&market_cap_max=100000000&limit=5000', {
      headers: {
        'X-CMC_PRO_API_KEY': 'd996075f-c301-4197-8ed6-f964982d64fc',
      },
    });
  } catch(ex) {
    response = null;
    // error
    console.log(ex);
    reject(ex);
  }
  if (response) {
    // success
    const result = response.data.data
    result.sort((a, b) => parseFloat(b.quote.USD.volume_change_24h) - parseFloat(a.quote.USD.volume_change_24h));
    const resultFiltered = result.filter(r => r.quote.USD.volume_change_24h > 10);

    let volume = ""
    for (let i = 0; i < resultFiltered.length; i++) {
      volume += "<tr><td>" + i + "</td>" + "<td>" + resultFiltered[i].symbol + "</td>" + "<td>" + resultFiltered[i].quote.USD.volume_24h + "</td>" + "<td>" + resultFiltered[i].quote.USD.volume_change_24h + "</td></tr>"
    }
    app.get('/', (req, res) => {
      res.send("<table><tr><th>" + "</th>" + "<th>SYMBOL</th>" + "<th>VOLUME</th>" + "<th>24H VOLUME CHANGE</th></tr>" + volume + "</table>");
    });

  }
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
});
