FROM swaggerapi/swagger-codegen-cli as codegen
WORKDIR /opt/swagger-codegen-cli
COPY api.yaml .
RUN java -jar swagger-codegen-cli.jar generate -i api.yaml -l typescript-fetch -o api -DsupportsES6=true

# start with building the frontend
FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY ./frontend/package*.json ./
RUN echo 'Installing frontend dependencies...' && npm install && npm install -g serve

# copy api files
COPY --from=codegen /opt/swagger-codegen-cli/api ./src/api

# Copy all project files and build project
COPY ./frontend .
RUN echo 'Building frontend...' && npm run build
EXPOSE 5000
CMD [ "serve", "-s", "build" ]
