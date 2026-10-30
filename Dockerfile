# Etapa 1: build
FROM node:22-alpine AS build
# Se difine el directorio de trabajo
WORKDIR /app

# archivos de dependencias.
COPY package*.json ./

# Comando para instalar las dependencias.
RUN npm ci

# Copia el código del proyecto a /app
COPY . .
# Compila el proyecto
RUN npm run build

# Etapa 2: servir con nginx
# Imagen nuevo de nginx, se descarta todo menos lo copiado
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]