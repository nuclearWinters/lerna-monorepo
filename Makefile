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
cass-up:
	docker compose -f docker-compose-mongo.yml up
cass-down:
	docker compose -f docker-compose-mongo.yml down
test:
	docker compose -f docker-compose-test.yml up
untest:
	docker compose -f docker-compose-test.yml down