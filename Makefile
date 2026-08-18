.PHONY: install dev build typecheck test database-generate database-seed docker-up docker-down

install:
	npm install

dev:
	npm run dev

build:
	npm run build

typecheck:
	npm run typecheck

test:
	npm test

database-generate:
	npm run db:generate

database-seed:
	npm run db:seed

docker-up:
	npm run docker:up

docker-down:
	npm run docker:down
