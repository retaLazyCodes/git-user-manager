CREATE TABLE "users" (
	 "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	 "user_name" TEXT(255,0) NOT NULL,
	 "email" TEXT(255,0) NOT NULL
);
CREATE INDEX "user_name_index" ON users ("user_name" COLLATE NOCASE ASC);
CREATE INDEX "email_index" ON users ("email" COLLATE NOCASE ASC);
-- INSERT INTO `users` VALUES (NULL, "Jango", "jango@jango.com"), (NULL, "Svend", "svend@contact.com");
