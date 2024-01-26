FROM 769325152790.dkr.ecr.us-west-2.amazonaws.com/marketplace:base-nodejs-16.9.1

RUN apk update
RUN apk add --no-cache --virtual .gyp alpine-sdk git python3 yarn

# Only include the files that are necessary for the application, always double check
# the .dockerignore file prior to running docker build
WORKDIR /usr/src/app
COPY . .

# Trigger the run commands
RUN yarn install
RUN yarn global add serve
RUN yarn build
RUN export PATH="$PATH:$(yarn global bin)"

# Reduce the image size after every build
RUN apk del .gyp

EXPOSE 7777
CMD [ "yarn", "start"]
