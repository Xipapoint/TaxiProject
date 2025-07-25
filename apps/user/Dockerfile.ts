FROM node:20-alpine

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем весь проект (монорепо)
COPY . .

# Билдим проект через nx
RUN npx nx build user

# Переходим в папку с билдом
WORKDIR /app/dist/apps/user

# Запускаем миграции
CMD ["npm", "run", "migration:run"]
