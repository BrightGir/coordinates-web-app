FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --verbose
RUN npm install react-router-dom react-redux redux redux-thunk
COPY . ./

CMD ["npm", "run", "dev", "--", "--host"]
