const express = require('express')
const app = express()
const port = process.env.PORT || 80
const axios = require('axios')
const api_key = require('./key.json')
const base = 'http://www.airnowapi.org/aq/observation/zipCode/current/'

app.get('/', async (req, res) => {
  // Default Zip: San Francisco
  let defaultZip = 94109
  let params = {
    format: 'application/json',
    zipCode: defaultZip,
    distance: 5
  }
  if (req.query.zip) {
    if (parseInt(req.query.zip) > 0 && parseInt(req.query.zip) <= 99999) {
      params.zipCode = parseInt(req.query.zip)
    }
  }
  console.log(`sending: ${JSON.stringify(params)}`)
  let url = buildUrlString(base, api_key, params)
  let response = await cUrl(url)
  let AQI = await getAQI(response.data)
  let level = await getLevel(parseInt(AQI.AQI))
  console.log(`Current[${AQI.AQI}]: ${AQI.HourObserved}:00 ${AQI.LocalTimeZone} ${AQI.DateObserved}`)
  res.send(
    `<html>
  <head>
    <title>Current Air Quality</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
    body {
      background-color: ${level.color};
      font-family: helvetica, verdana;
      max-width: 500px;
      margin: 20px auto;
      text-align:center;
    }
    </style>
  </head>
  <body>
    <h1>Air Quality: ${AQI.AQI}</h1>
    </h2>${AQI.ReportingArea} - ${AQI.HourObserved}:00 ${AQI.LocalTimeZone} ${AQI.DateObserved}</h2>
    <br /><br />
    ${level.message}
  </body>
</html>`
  )
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// Functions

async function getLevel (AQI) {
  let quality = {
    'good': 'AQI: Good (0 - 50)<br />Air quality is considered satisfactory, and air pollution poses little or no risk.',
    'moderate': 'AQI: Moderate (51 - 100)<br />Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.',
    'usg': 'AQI: Unhealthy for Sensitive Groups (101 - 150)<br />Although general public is not likely to be affected at this AQI range, people with lung disease, older adults and children are at a greater risk from exposure to ozone, whereas persons with heart and lung disease, older adults and children are at greater risk from the presence of particles in the air.',
    'unhealthy': 'AQI: Unhealthy (151 - 200)<br />Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.',
    'very unhealthy': 'AQI: Very Unhealthy (201 - 300)<br />Health alert: everyone may experience more serious health effects.',
    'hazardous': 'AQI: Hazardous (301+)<br />Health warnings of emergency conditions. The entire population is more likely to be affected.'
  }
  let colors = {
    'good': '#0C0',
    'moderate': '#FFFF00',
    'usg': '#FF9900',
    'unhealthy': '#FF0000',
    'very unhealthy': '#990066',
    'hazardous': '#660000'
  }
  let index = Math.floor((AQI/50))
  let track = 0
  for (let level in quality) {
    if (track == index) {
      return {'level': level, 'message': quality[level], 'color': colors[level]}
    }
    track++
  }
}

async function getAQI (obj, paramName = 'PM2.5') {
  for (let that in obj) {
    let thisObj = obj[that]
    if (thisObj['ParameterName'] == paramName) {
      return thisObj
    }
  }
}

function buildUrlString (base, api_key, params) {
  let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&')
  console.log(`queryString: ${queryString}`)
  let url = `${base}?${queryString}&API_KEY=${api_key}`
  return url
}

async function cUrl (url) {
  return axios.get(url)
}

