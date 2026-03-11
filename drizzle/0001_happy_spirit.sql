-- Clean up seed data that has no Stack Auth identity
DELETE FROM "email_logs" WHERE "user_id" IN (SELECT "id" FROM "users");--> statement-breakpoint
DELETE FROM "resource_likes" WHERE "user_id" IN (SELECT "id" FROM "users");--> statement-breakpoint
DELETE FROM "reviews" WHERE "user_id" IN (SELECT "id" FROM "users");--> statement-breakpoint
DELETE FROM "purchases" WHERE "user_id" IN (SELECT "id" FROM "users");--> statement-breakpoint
DELETE FROM "resource_files" WHERE "resource_id" IN (SELECT "id" FROM "resources");--> statement-breakpoint
DELETE FROM "resources" WHERE "creator_id" IN (SELECT "id" FROM "users");--> statement-breakpoint
DELETE FROM "users";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "stack_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_stack_id_unique" UNIQUE("stack_id");
