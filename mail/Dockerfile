#  official Node.js image 
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the application to the /app directory and install dependencies
COPY scripts /usr/src/app/scripts
COPY package.json /usr/src/app
RUN npm install

COPY . /usr/src/app

# Expose port to the outside once the container has launched
EXPOSE 4005

#Default command
CMD ["./scripts/wait-for-it.sh", "rabbitmq:5672", "--", "npm", "start"]