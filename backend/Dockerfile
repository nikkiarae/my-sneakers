FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
# Generate the Prisma client and sync the schema to the database before starting.
# `db push` is idempotent, so this is safe to run on every container start.
CMD ["sh", "-c", "npx prisma generate && npx prisma db push && npm run start:dev"]
