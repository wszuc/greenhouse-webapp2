CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" varchar(50) NOT NULL,
	"info" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
