CREATE TABLE `analysisResults` (
	`id` int AUTO_INCREMENT NOT NULL,
	`imageId` int NOT NULL,
	`modelName` varchar(100) NOT NULL,
	`modelVersion` varchar(50),
	`confidenceScore` int,
	`predictions` json NOT NULL,
	`findings` json,
	`recommendations` json,
	`severity` enum('normal','mild','moderate','severe','critical'),
	`processingTimeMs` int,
	`reviewedBy` int,
	`reviewNotes` text,
	`reviewedAt` timestamp,
	`analyzedAt` timestamp NOT NULL DEFAULT (now()),
	`metadata` json,
	CONSTRAINT `analysisResults_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `auditLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`action` varchar(100) NOT NULL,
	`resourceType` varchar(50),
	`resourceId` int,
	`ipAddress` varchar(45),
	`userAgent` text,
	`details` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`documentType` enum('medical','report','scan','other') NOT NULL DEFAULT 'medical',
	`status` enum('draft','pending','analyzed','reviewed','archived') NOT NULL DEFAULT 'draft',
	`patientName` varchar(255),
	`patientAge` int,
	`patientGender` enum('male','female','other'),
	`patientId` varchar(100),
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentId` int,
	`userId` int NOT NULL,
	`originalName` varchar(255) NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`fileUrl` varchar(500) NOT NULL,
	`fileSize` int,
	`mimeType` varchar(100),
	`width` int,
	`height` int,
	`imageType` enum('xray','mri','ct','ultrasound','photo','document','other'),
	`bodyPart` varchar(100),
	`status` enum('pending','analyzing','analyzed','failed') NOT NULL DEFAULT 'pending',
	`metadata` json,
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`planType` enum('free','basic','pro','enterprise') NOT NULL DEFAULT 'free',
	`status` enum('active','canceled','expired','suspended') NOT NULL DEFAULT 'active',
	`analysesLimit` int NOT NULL DEFAULT 10,
	`analysesUsed` int NOT NULL DEFAULT 0,
	`priceCents` int DEFAULT 0,
	`currency` varchar(3) DEFAULT 'USD',
	`billingCycle` enum('monthly','yearly'),
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	`autoRenew` boolean NOT NULL DEFAULT true,
	`metadata` json,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','doctor') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `organization` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `specialty` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `licenseNumber` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `isVerified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `analysisResults` ADD CONSTRAINT `analysisResults_imageId_images_id_fk` FOREIGN KEY (`imageId`) REFERENCES `images`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `analysisResults` ADD CONSTRAINT `analysisResults_reviewedBy_users_id_fk` FOREIGN KEY (`reviewedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `auditLogs` ADD CONSTRAINT `auditLogs_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `documents` ADD CONSTRAINT `documents_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `images` ADD CONSTRAINT `images_documentId_documents_id_fk` FOREIGN KEY (`documentId`) REFERENCES `documents`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `images` ADD CONSTRAINT `images_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `imageId_idx` ON `analysisResults` (`imageId`);--> statement-breakpoint
CREATE INDEX `analyzedAt_idx` ON `analysisResults` (`analyzedAt`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `auditLogs` (`userId`);--> statement-breakpoint
CREATE INDEX `createdAt_idx` ON `auditLogs` (`createdAt`);--> statement-breakpoint
CREATE INDEX `action_idx` ON `auditLogs` (`action`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `documents` (`userId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `documents` (`status`);--> statement-breakpoint
CREATE INDEX `createdAt_idx` ON `documents` (`createdAt`);--> statement-breakpoint
CREATE INDEX `documentId_idx` ON `images` (`documentId`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `images` (`userId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `images` (`status`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `subscriptions` (`userId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `subscriptions` (`status`);--> statement-breakpoint
CREATE INDEX `expiresAt_idx` ON `subscriptions` (`expiresAt`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);