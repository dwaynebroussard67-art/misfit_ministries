CREATE TABLE `content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`type` varchar(50) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`body` text,
	`excerpt` text,
	`published` boolean NOT NULL DEFAULT false,
	`featuredImage` varchar(255),
	`order` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_id` PRIMARY KEY(`id`),
	CONSTRAINT `content_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `nuraConversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`messageCount` int NOT NULL DEFAULT 0,
	`lastMessage` timestamp,
	`crisisFlag` boolean NOT NULL DEFAULT false,
	`crisisFlaggedAt` timestamp,
	`crisisKeywords` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `nuraConversations_id` PRIMARY KEY(`id`),
	CONSTRAINT `nuraConversations_sessionId_unique` UNIQUE(`sessionId`)
);
--> statement-breakpoint
CREATE TABLE `prayers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text,
	`request` text NOT NULL,
	`category` varchar(50),
	`status` varchar(20) NOT NULL DEFAULT 'pending',
	`prayerCount` int NOT NULL DEFAULT 0,
	`isAnonymous` boolean NOT NULL DEFAULT false,
	`crisisFlag` boolean NOT NULL DEFAULT false,
	`flaggedKeywords` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `prayers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`category` varchar(50) NOT NULL,
	`phone` varchar(20),
	`url` varchar(255),
	`available247` boolean NOT NULL DEFAULT false,
	`order` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `resources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `siteCopy` (
	`key` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`description` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `siteCopy_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `testimonies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text,
	`title` text,
	`story` text NOT NULL,
	`approved` boolean NOT NULL DEFAULT false,
	`autoApproved` boolean NOT NULL DEFAULT false,
	`featured` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `testimonies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `content_type_idx` ON `content` (`type`);--> statement-breakpoint
CREATE INDEX `content_slug_idx` ON `content` (`slug`);--> statement-breakpoint
CREATE INDEX `content_published_idx` ON `content` (`published`);--> statement-breakpoint
CREATE INDEX `nuraConversations_sessionId_idx` ON `nuraConversations` (`sessionId`);--> statement-breakpoint
CREATE INDEX `nuraConversations_crisis_idx` ON `nuraConversations` (`crisisFlag`);--> statement-breakpoint
CREATE INDEX `prayers_status_idx` ON `prayers` (`status`);--> statement-breakpoint
CREATE INDEX `prayers_crisis_idx` ON `prayers` (`crisisFlag`);--> statement-breakpoint
CREATE INDEX `resources_category_idx` ON `resources` (`category`);--> statement-breakpoint
CREATE INDEX `resources_order_idx` ON `resources` (`order`);--> statement-breakpoint
CREATE INDEX `testimonies_approved_idx` ON `testimonies` (`approved`);--> statement-breakpoint
CREATE INDEX `testimonies_featured_idx` ON `testimonies` (`featured`);