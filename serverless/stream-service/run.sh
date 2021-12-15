#!/bin/bash

VIDEOFILE=./assets/shopping.mp4
STREAM_TIME="$((INTERVAL_SECONDS + 10))"

printf "STREAM_TIME value: ${STREAM_TIME}"

while :
do
  echo "Stream started"
  ffmpeg -t $STREAM_TIME -re -stream_loop -1 -i $VIDEOFILE -r 30 -c:v libx264 -pix_fmt yuv420p -profile:v main -preset veryfast -x264opts "nal-hrd=cbr:no-scenecut" -minrate 2000 -maxrate 2500 -g 60 -c:a aac -b:a 160k -ac 2 -ar 44100 -f flv $IVS_INGEST_URL
  echo "Stream finished"
  timeout $INTERVAL_SECONDS node ./server.js
done