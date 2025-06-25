# Estágio de construção
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Define um argumento de build para a URL da API
ARG NEXT_PUBLIC_API_URL_BUILD

# Usa o argumento de build para definir a variável de ambiente
# Esta variável será embutida no código JavaScript do cliente durante o 'npm run build'
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL_BUILD}

RUN npm run build

# Estágio de produção
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# A variável NEXT_PUBLIC_API_URL já foi definida no estágio de build e embutida no código.
# Não precisamos defini-la novamente aqui para o client-side.


COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
