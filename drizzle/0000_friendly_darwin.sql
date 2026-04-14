CREATE TABLE "short_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"slug" varchar(128) NOT NULL,
	"original_url" text NOT NULL,
	"title" text,
	"clicks" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "short_links_user_id_slug_key" ON "short_links" USING btree ("user_id","slug");