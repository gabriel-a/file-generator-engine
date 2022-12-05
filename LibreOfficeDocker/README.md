## Docker build
docker build -t gabriel82/my-node-libre .

### Push to docker hub
docker push gabriel82/my-node-libre:latest

docker image tag gabriel82/my-node-libre:latest gabriel82/my-node-libre:v1
docker image push --all-tags gabriel82/my-node-libre