FROM node:22

WORKDIR /usr/src/app

ARG PRIVY_APP_ID
ARG PRIVY_APP_SECRET
ARG PRIVY_PRIVATE_KEY

RUN \
  apt-get update \
  && apt-get -y install gettext-base postgresql-client \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* \
  && npm install -g pnpm knex ts-node

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

# Make startup script executable
RUN chmod +x docker-startup.sh

# Build the application
RUN pnpm run build

# Expose the port
EXPOSE 3001

# Default command (can be overridden in docker-compose)
CMD [ "pnpm", "run", "dev" ]
