CREATE TABLE "readings" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" integer NOT NULL,
	"temperature" double precision NOT NULL,
	"humidity" double precision NOT NULL,
	"light" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "readings" ADD CONSTRAINT "readings_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;