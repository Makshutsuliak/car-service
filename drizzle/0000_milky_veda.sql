CREATE TABLE "cars" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"brand" varchar NOT NULL,
	"model" varchar NOT NULL,
	"plate" varchar NOT NULL,
	CONSTRAINT "cars_plate_unique" UNIQUE("plate")
);
--> statement-breakpoint
CREATE TABLE "contact_form" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"comment" varchar(500) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"car_id" integer NOT NULL,
	"service_name" varchar(255) NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"price" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar(100) NOT NULL,
	"firstname" varchar(50) NOT NULL,
	"lastname" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_type" smallint DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_car_id_cars_id_fk" FOREIGN KEY ("car_id") REFERENCES "public"."cars"("id") ON DELETE cascade ON UPDATE no action;