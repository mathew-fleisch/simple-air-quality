FROM node:9
EXPOSE 80

RUN apt-get update --fix-missing
RUN apt-get update
RUN apt-get upgrade -y
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y vim man

COPY . /app
WORKDIR /app
RUN rm -rf node_modules && npm install && npm install -g nodemon
CMD nodemon index.js
