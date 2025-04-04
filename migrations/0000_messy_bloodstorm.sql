CREATE TABLE `article` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`link` text NOT NULL,
	`pubDate` text NOT NULL,
	`hostname` text NOT NULL,
	`pv` integer,
	`like` integer,
	`update_at` integer,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `config` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `rss` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`rss_url` text NOT NULL,
	`title` text NOT NULL,
	`email` text,
	`is_deleted` integer,
	`error_count` integer,
	`audit_status` integer,
	`init` integer,
	`update_at` integer,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rss_rss_url_unique` ON `rss` (`rss_url`);