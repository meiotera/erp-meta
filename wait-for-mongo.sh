# Crie o arquivo wait-for-mongo.sh no diretório raiz
# Conteúdo do wait-for-mongo.sh
#!/bin/sh
until nc -z mongo 27017; do
  echo "Aguardando o MongoDB iniciar..."
  sleep 2
done
echo "MongoDB está ativo! Iniciando o app."
exec "$@"
