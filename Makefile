up:
	docker compose -f docker-compose-mongo.yml up
down:
	docker compose -f docker-compose-mongo.yml down
setup:
	docker volume create lerna-node-modules \
	&& docker volume create backend-auth-node \
	&& docker volume create backend-fintech-mongo \
	&& docker volume create backend-fintech-mongo-cron \
	&& docker volume create kafka-mongo \
	&& docker volume create grpc-fintech-node \
	&& docker volume create grpc-auth-node \
	&& docker volume create frontend-fintech \
	&& docker volume create repo-graphql-utils \
	&& docker volume create repo-grpc-utils \
	&& docker volume create repo-jwt-utils \
	&& docker volume create repo-kafka-utils \
	&& docker volume create repo-logs-utils \
	&& docker volume create repo-mongo-utils \
	&& docker volume create repo-redis-utils \
	&& docker volume create repo-utils
install:
	docker-compose -f docker-compose.builder.yml run --rm install
outdated:
	docker-compose -f docker-compose.builder.yml run --rm outdated
update:
	docker-compose -f docker-compose.builder.yml run --rm update
proto:
	docker-compose -f docker-compose.builder.yml run --rm proto