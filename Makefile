up:
	docker compose -f docker-compose-mongo.yml up
down:
	docker compose -f docker-compose-mongo.yml down
cass-up:
	docker compose -f docker-compose-mongo.yml up
cass-down:
	docker compose -f docker-compose-mongo.yml down
test:
	docker compose -f docker-compose-test.yml up
untest:
	docker compose -f docker-compose-test.yml down