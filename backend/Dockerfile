# ======================== (start) REFERENCE:github/docker ==================   */
# Dockerfile for our express backend!
# Modifications: Use port 8080 
# ----------------------------------------------------------------------------- */
# syntax=docker/dockerfile:1.4

# if you're doing anything beyond your local machine, please pin this to a specific version at https://hub.docker.com/_/node/
FROM node:lts AS development

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /code

# (reference) default to port 80 for node, and 9229 and 9230 (tests) for debug
# - JT changed 80 to 5000 (8080, 8081 didn't work).
# - 4/26/24 change by dan, changed 5000 to 8080 again, DB seems to use port 5000
#ERROR: project-discodb-main-db-1 | Error response from daemon: Ports are not available: listen tcp 0.0.0.0:5000: bind: address already in use
ARG PORT=8080
ENV PORT $PORT
# JT note to self: apparently expose is just for documentation, it doesn't actually map ports :p
EXPOSE $PORT 9229 9230

COPY package.json /code/package.json
COPY package-lock.json /code/package-lock.json
RUN npm ci

# check every 30s to ensure this service returns HTTP 200
HEALTHCHECK --interval=30s \
  CMD node healthcheck.js

# copy in our source code last, as it changes the most
COPY .. /code

# if you want to use npm start instead, then use `docker run --init in production`
# so that signals are passed properly. Note the code in index.js is needed to catch Docker signals
# using node here is still more graceful stopping then npm with --init afaik
# I still can't come up with a good production way to run with npm and graceful shutdown
CMD [ "node", "src/index.js" ]

FROM development as dev-envs

RUN apt-get update
RUN apt-get install -y --no-install-recommends git

RUN useradd -s /bin/bash -m vscode
RUN groupadd docker
RUN usermod -aG docker vscode

# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /

# ======================== ( end ) REFERENCE:github/docker ==================
