# Simple Air Quality Index

This project uses EPA data to show the current AQI for SF, using their API. Many of the parameters are hardcoded, because SF is all I care about at the moment. Wildfires suck.

### Usage

```
docker build -t air-quality .
docker run --name air-quality -p 3000:80 air-quality:latest
```
[http://localhost:3000/](http://localhost:3000/)