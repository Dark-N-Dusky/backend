FROM node:24-alpine AS builder

WORKDIR /backend

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:24-alpine AS development

WORKDIR /backend

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3200

CMD ["npm", "run", "start:dev"]

FROM node:24-alpine AS production

WORKDIR /backend

COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts

COPY --from=builder /backend/dist /backend/dist

EXPOSE 3200

CMD ["npm", "run", "start:prod"]