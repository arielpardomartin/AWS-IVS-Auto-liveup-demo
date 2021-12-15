FROM node:alpine

# Environment variables
ARG ENV_INTERVAL_SECONDS ""
ENV INTERVAL_SECONDS $ENV_INTERVAL_SECONDS

RUN apk add --no-cache ffmpeg
WORKDIR /usr/src
COPY . ./
RUN npm i
RUN chmod +x run.sh

CMD sh run.sh