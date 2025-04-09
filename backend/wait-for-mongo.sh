until wget -q --spider mongo:27017; do
    echo "Aguardando o MongoDB iniciar..."
    sleep 1
done
echo "MongoDB está disponível. Iniciando a aplicação..."
exec "$@"
