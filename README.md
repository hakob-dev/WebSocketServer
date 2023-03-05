# WebSocketServer

## Contents
* `zookeeper` and `broker` services in `docker-compose.yml` file are responsible for kafka.
* `publisher` service is replicated `MICROSERVICES_COUNT` times, thus it creates many containers producing messages into the kafka topic `my-topic`.
* `consumer` service starts the web socker server (`3000` port), which consumes messages from `my-topic` and sends messages to all the connected socket clients.
* `proxy` service uses the Nginx web server as a reverse proxy, and it proxies to the `consumer` running on `3000` port with configuration of the `nginx/default.conf` file.
Using Nginx here will be helpful for scaling the socket server in the future if we want to handle many active clients. We could do this by            replicating the `consumer` (starting many `consumer` containers) with enabled sticky sessions and balance the load between them with Ngnix.

## How to start
* clone the repository
* cd to the repository
* run `docker-compose up` (make sure to run `docker-compose down` before running `docker-compose up` again)
* many logs will be displayed but eventually you will see the logs of publisher containers producing into the kafka topic `my-topic`
* open the browser on `localhost` (no port is needed since we configured Ngnix)
* see the messeges from socketServer on the web, you can also connect to the socketServer without browser (NodeJS socket.io client)
