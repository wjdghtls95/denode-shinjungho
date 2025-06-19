FROM node:18-slim
WORKDIR /app

RUN npm install -g pnpm

COPY package*.json ./
RUN pnpm install

COPY . .
RUN pnpm run build

CMD ["node", "dist/apps/api/src/main"]