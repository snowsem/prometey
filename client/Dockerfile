FROM node:14.15-alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY . .
RUN npm i
CMD ["npm", "run", "start"]