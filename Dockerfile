FROM alpine
MAINTAINER Chris Sheppard

# Setup
ENV PORT=4000 NODE_ENV=production
EXPOSE 4000

RUN apk update && \
    apk upgrade && \
    apk add nodejs && \
    rm -rf /var/cache/apk/* && \
    mkdir -p /app

# Install
ADD package.json /app/
RUN cd /app && \
    npm --cache-min=604800 install

WORKDIR /app
ADD . /app

# Build
RUN npm run build

# Run
#CMD ["start"]
#ENTRYPOINT "npm"
CMD npm start
