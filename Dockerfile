# Use a imagem oficial do Node.js como base
FROM node:20-alpine

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Copie o script de espera
# COPY wait-for-mongo.sh /wait-for-mongo.sh

# Permita que o script seja executável
# RUN chmod +x /wait-for-mongo.sh

# Instale as dependências do projeto
RUN npm install

# Copie o restante do código do projeto para o diretório de trabalho
COPY . .

# Execute o build da aplicação
RUN npm run build

# Exponha a porta que o aplicativo irá usar
EXPOSE 3000

# Comando para iniciar o aplicativo
CMD ["npm", "run", "start"]