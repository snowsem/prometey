FROM node:14.15-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
#COPY .env /app/.env
RUN npm run build
EXPOSE 8888
CMD ["node", "dist/main.js"]


#FROM node:14.15-alpine as production
#
#ARG NODE_ENV=production
#ENV NODE_ENV=${NODE_ENV}
#
#WORKDIR /app
#
#COPY package*.json ./
#
#RUN npm install --only=production
#
#COPY . .
#
#COPY --from=development /usr/src/app/dist ./dist
#
#CMD ["node", "dist/main"]