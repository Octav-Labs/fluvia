FROM node:22

WORKDIR /usr/src/app

RUN \
  apt-get update \
  && apt-get -y install gettext-base \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* \
  && npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

# Build the application
RUN pnpm run build

# Expose the port
EXPOSE 3000

# Default command (can be overridden in docker-compose)
CMD [ "pnpm", "run", "dev" ]
