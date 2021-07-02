start-dev:
	docker-compose -f docker-compose-dev.yml up --build -d

stop-dev:
	docker-compose -f docker-compose-dev.yml down

restart-dev: generate-keys
	docker-compose -f docker-compose-dev.yml down
	docker-compose -f docker-compose-dev.yml up --build -d

generate-keys:
	./scripts/generate_keys.sh