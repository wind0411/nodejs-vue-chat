# FROM ubuntu

# ビルド環境
FROM node:12-alpine as build-stage
WORKDIR /var/www/html
# COPY . /var/www/html/client
RUN apk update && \
  apk add npm && \
  npm install -g npm @vue/cli
RUN yarn

# CMD ["/bin/bash"]
CMD ["/bin/sh"]

# RUN npm run build
