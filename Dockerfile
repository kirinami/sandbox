FROM node:18.16-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /builder
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
ENV NODE_ENV production
RUN yarn build

FROM node:18.16-alpine AS runner
WORKDIR /app
COPY --from=builder /builder .
ENV NODE_ENV production
EXPOSE 4173
CMD [ "yarn", "start" ]
