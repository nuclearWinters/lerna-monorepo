setup:
	docker volume create nodemodules
install:
	docker-compose	-f docker-compose.builder.yml run --rm install
up:
	docker-compose -f docker-compose.dev.yml up
down:
	docker-compose -f docker-compose.dev.yml down