#!/bin/sh

# Esperar até que o MongoDB esteja disponível
until nc -z -v -w30 mongo 27017
do
  echo "Aguardando o MongoDB iniciar..."
  sleep 1
done

echo "MongoDB está disponível. Iniciando a aplicação..."
exec "$@"