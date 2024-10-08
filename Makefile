up:
	docker compose -f docker-compose-mongo.yml up
down:
	docker compose -f docker-compose-mongo.yml down
setup:
	docker volume create lerna-node-modules && docker volume create backend-auth-node && docker volume create backend-fintech-mongo && docker volume create backend-fintech-mongo-cron && docker volume create frontend-fintech && docker volume create kafka-mongo && docker volume create grpc-auth-node && docker volume create grpc-fintech-node && docker volume create backend-utilities && docker volume create frontend-fintech
install:
	docker-compose -f docker-compose.builder.yml run --rm install
outdated:
	docker-compose -f docker-compose.builder.yml run --rm outdated
update:
	docker-compose -f docker-compose.builder.yml run --rm update
proto:
	docker-compose -f docker-compose.builder.yml run --rm proto
build:
	docker-compose -f docker-compose.builder.yml run --rm build