CREATE TYPE "public"."category" AS ENUM('food_and_beverage', 'groceries', 'income', 'transport', 'gifts', 'electrical_appliances', 'others');--> statement-breakpoint
CREATE TABLE "data_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"date" timestamp NOT NULL,
	"category" "category" NOT NULL
);
