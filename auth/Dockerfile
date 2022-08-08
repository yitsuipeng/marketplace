FROM node:alpine

WORKDIR /app
COPY pachage.json .
RUN npm install
COPY . .

CMD ["npm", "start"]