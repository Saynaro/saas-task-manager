FROM node:25-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Vite uses port 5173 for default
EXPOSE 5173
# The --host flag is needed for Vite to accept connections from outside the container
CMD ["npm", "run", "dev", "--", "--host"]