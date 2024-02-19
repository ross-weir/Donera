#!/bin/sh

db_name="donera-db"

if [ "$(docker ps -a -q -f name=$db_name)" ]; then
    docker start $db_name
fi

# prisma requires mongodb replicas, this sets up local mongodb with replicas
# NOTE !!!
# there seems to be a race condition with the execution of below causing errors
# restarting it a few times and it eventually works... meh
sleep 2
docker run --name $db_name -d -p 27017:27017 mongo:latest mongod --replSet rs
docker exec -d $db_name mongosh --eval "rs.initiate({_id: 'rs', members: [{_id: 0, host: 'localhost:27017'}]})"
docker attach $db_name

