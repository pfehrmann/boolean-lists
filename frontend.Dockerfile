FROM swaggerapi/swagger-codegen-cli as codegen
WORKDIR /opt/swagger-codegen-cli
COPY api.yaml .
RUN java -jar swagger-codegen-cli.jar generate -i api.yaml -l typescript-fetch -o api -DsupportsES6=true

# start with building the frontend
FROM oven/bun:1

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY ./frontend/package*.json ./
RUN echo 'Installing frontend dependencies...' && bun install && bun install -g serve

# copy api files
COPY --from=codegen /opt/swagger-codegen-cli/api ./src/api

# Copy all project files and build project
COPY ./frontend .
RUN echo 'Building frontend...' && timeout 60 bun run build || exit 0
EXPOSE 5000
CMD [ "bunx", "serve", "-s", "build" ]
