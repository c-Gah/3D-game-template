# Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
#FROM node:16
FROM node:16

# Create and change to the app directory.
WORKDIR /usr/src/app

# These variables are set via contaier settins
# ENV PORT 8080
# ENV HOST 0.0.0.0

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./
# COPY ./src/client/vite.config.js ./src/client/vite.config.js

RUN ls -a

# Install production dependencies.
#RUN npm install --only=production
RUN npm install

RUN ls -a

# Copy local code to the container image.
COPY . ./
# COPY . .

# This might not be needed. Putting the build up instead of building in the cloud?
# RUN npm run build

# Run the web service on container startup.
# CMD [ "npm", "start" ]
CMD npm start