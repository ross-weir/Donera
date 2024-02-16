#!/bin/sh

db_name="donera-db"

if [ "$(docker ps -a -q -f name=$db_name)" ]; then
    docker start $db_name
else
    docker run --name $db_name -d -p 27017:27017 mongo:latest mongod --replSet rs
    # prisma requires mongodb replicas, this sets up local mongodb with replicas
    docker exec -d $db_name mongosh --eval "rs.initiate({_id: 'rs', members: [{_id: 0, host: 'localhost:27017'}]})"
fi

docker attach $db_name
