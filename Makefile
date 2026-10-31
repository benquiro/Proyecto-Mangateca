-include .env
export

COMPOSE = docker compose --env-file .env -f infra/docker-compose.yml
API_DIR = app/api

db-up:
	$(COMPOSE) up -d --wait

db-down:
	$(COMPOSE) down

app-up:
	cd $(API_DIR) && ./mvnw spring-boot:run

backend-up: db-up app-up

.PHONY: db-up db-down app-up backend-up