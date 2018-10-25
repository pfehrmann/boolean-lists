# start with building the frontend
FROM node:8 as frontend

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY ./frontend/package*.json ./
RUN echo 'Installing frontend dependencies...' && npm install && npm install -g serve

# Copy all project files and build project
COPY ./frontend .
RUN echo 'Building frontend...' && npm run build
EXPOSE 5000
CMD [ "serve", "-s", "build" ]