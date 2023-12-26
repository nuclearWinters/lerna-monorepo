up:
	docker compose -f docker-compose.yml up
down:
	docker compose -f docker-compose.yml down
test:
	docker compose -f docker-compose-test.yml up
untest:
	docker compose -f docker-compose-test.yml down