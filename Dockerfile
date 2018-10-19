# start with building the frontend
FROM node:8 as frontend

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY ./frontend/package*.json ./
RUN echo 'Installing frontend dependencies...' && npm install

# Copy all project files and build project
COPY ./frontend .
RUN echo 'Building frontend...' && npm run build

FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY ./backend/package*.json ./
RUN echo 'Installing backend dependencies...' && npm install --only=production && npm install gulp -g && npm i gulp --save

# Copy project files
COPY ./backend .

# Copy static files from frontend
COPY --from=frontend /usr/src/app/build ./frontend

EXPOSE 3000
CMD [ "npm", "start", "--production"]
