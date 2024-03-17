FROM oven/bun:1

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY ./backend/package*.json ./
RUN echo 'Installing backend dependencies...' && bun install

# Copy project files
COPY ./backend .

EXPOSE 3000
CMD [ "bun", "start"]
