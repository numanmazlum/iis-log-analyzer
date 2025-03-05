FROM node:23-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
# Change CMD to run "vite --host 0.0.0.0"
CMD ["npm", "run", "dev", "--host", "0.0.0.0"]
