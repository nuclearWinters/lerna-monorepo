up:
	docker compose -f docker-compose-mongo.yml up
down:
	docker compose -f docker-compose-mongo.yml down
setup:
	docker volume create lerna-node-modules
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