setup_backend_auth:
	docker volume create node_modules_backend_auth
setup_backend_courses:
	docker volume create node_modules_backend_courses
setup_gateway:
	docker volume create node_modules_gateway
setup_frontend:
	docker volume create node_modules_frontend
setup_lerna:
	docker volume create node_modules_lerna
install_backend_auth:
	docker-compose	-f docker-compose.builder.yml run --rm install_backend_auth
install_backend_courses:
	docker-compose	-f docker-compose.builder.yml run --rm install_backend_courses
install_gateway:
	docker-compose	-f docker-compose.builder.yml run --rm install_gateway
install_frontend:
	docker-compose	-f docker-compose.builder.yml run --rm install_frontend
install_lerna:
	docker-compose	-f docker-compose.builder.yml run --rm install_lerna
up:
	docker-compose -f docker-compose.dev.yml up
down:
	docker-compose -f docker-compose.dev.yml down
up-prod:
	docker-compose -f docker-compose.prod.yml up
down-prod:
	docker-compose -f docker-compose.prod.yml down