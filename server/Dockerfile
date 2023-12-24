# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the server application files to the working directory
COPY . .

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]
