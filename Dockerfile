# Используем официальный образ Node.js в качестве базового
FROM node:20

WORKDIR /app

COPY package.json ./

ENV DATABASE_URL="postgresql://postgres:password@localhost:5432/db?schema=public"
ENV JWT_SECRET_KEY=your-secret-key



RUN npm install -g npm@11.1.0
# Устанавливаем зависимости
RUN npm install --force
RUN npx tsc --version

COPY . .
RUN npx prisma init

RUN npx prisma migrate dev


EXPOSE 3001

CMD ["npm", "run", "prod"]
