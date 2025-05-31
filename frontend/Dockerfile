# frontend/Dockerfile
FROM node:24-slim

# Set the working directory inside the container to /app.
WORKDIR /app

# Copy package.json and package-lock.json (if available) first.
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container.
COPY . .

# Expose port 5173 (default for Vite dev server) so it can be accessed externally.
EXPOSE 5173

# Set the default command to run the development server.
CMD ["npm", "run", "dev", "--", "--host"]