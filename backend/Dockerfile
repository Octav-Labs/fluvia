FROM node:20

WORKDIR /usr/src/app

RUN \
  apt-get update \
  && apt-get -y install gettext-base \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* \
  && npm install -g pnpm

COPY . .

# No environment file processing needed for now
RUN pnpm install
RUN pnpm run build

EXPOSE 3000

CMD [ "node", "." ]
