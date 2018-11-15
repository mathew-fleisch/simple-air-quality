# Simple Air Quality Index

This project uses EPA data to show the current AQI for SF, using their API. Many of the parameters are hardcoded, because SF is all I care about at the moment. Wildfires suck.

### Installation

This small website can run this in a docker container, or locally via node/nodemon. First you must acquire an api key from the EPA's website, and create a file 'key.json' with the api key in quotes.

```
git clone git@github.com:mathew-fleisch/simple-air-quality.git
npm install
PORT=3000 node index.js
```

***OR VIA DOCKER***

```
git clone git@github.com:mathew-fleisch/simple-air-quality.git
docker build -t air-quality .
docker run --name air-quality -p 3000:80 air-quality:latest
```

### Usage

[http://localhost:3000/?zip=94109](http://localhost:3000/?zip=94109)