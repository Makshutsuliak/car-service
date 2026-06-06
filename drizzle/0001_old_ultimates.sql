ALTER TABLE "services" ALTER COLUMN "date" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "cars" ADD COLUMN "vin" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "cars" ADD CONSTRAINT "cars_vin_unique" UNIQUE("vin");