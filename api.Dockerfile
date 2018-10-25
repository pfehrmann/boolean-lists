FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY ./backend/package*.json ./
RUN echo 'Installing backend dependencies...' && npm install --only=production && npm install gulp -g && npm i gulp --save

# Copy project files
COPY ./backend .

EXPOSE 3000
CMD [ "npm", "start", "--production"]
