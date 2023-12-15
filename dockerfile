# Use Node.js v16.18.0
FROM node:16.18.0

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the files
COPY . .

# Build the Angular app
RUN npm run build

# Expose port 4200
EXPOSE 4200

# Start the Angular app
CMD ["npm", "start"]
