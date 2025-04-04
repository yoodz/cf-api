CREATE TABLE `article` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`link` text NOT NULL,
	`pubDate` text NOT NULL,
	`hostname` text NOT NULL,
	`pv` integer DEFAULT 0,
	`like` integer DEFAULT 0,
	`update_at` integer DEFAULT 1743752052,
	`created_at` integer DEFAULT 1743752052
);
--> statement-breakpoint
CREATE TABLE `config` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`created_at` integer DEFAULT 1743752052
);
--> statement-breakpoint
CREATE TABLE `rss` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`rss_url` text NOT NULL,
	`title` text NOT NULL,
	`email` text DEFAULT '',
	`is_deleted` integer DEFAULT false,
	`error_count` integer DEFAULT 0,
	`audit_status` integer DEFAULT 0,
	`init` integer DEFAULT false,
	`update_at` integer DEFAULT 1743752052,
	`created_at` integer DEFAULT 1743752052
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rss_rss_url_unique` ON `rss` (`rss_url`);