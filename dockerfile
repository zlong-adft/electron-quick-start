# Use a Node.js base image
FROM node:lts-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app files to the container
COPY . .

# Expose the port that the app will listen on
EXPOSE 3000

# Start the app
CMD [ "node", "./express/index" ]