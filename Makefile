install:
	pnpm install
dev:
	pnpm dev
test:
	pnpm test
build:
	pnpm build
db-up:
	docker compose up -d postgres mqtt
db-migrate:
	pnpm db:migrate
