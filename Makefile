setup:
	docker volume create nodemodules
install:
	docker-compose	-f docker-compose.builder.yml run --rm install
bootstrap:
	docker-compose	-f docker-compose.builder.yml run --rm bootstrap
build:
	docker-compose	-f docker-compose.builder.yml run --rm build
up:
	docker-compose -f docker-compose.dev.yml up
down:
	docker-compose -f docker-compose.dev.yml down
up-prod:
	docker-compose -f docker-compose.prod.yml up
down-prod:
	docker-compose -f docker-compose.prod.yml down