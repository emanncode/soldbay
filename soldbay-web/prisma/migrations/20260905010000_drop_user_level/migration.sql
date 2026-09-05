-- idea.md (#5): "level" is intentionally not a Soldbay concept. Only the
-- university is collected at signup; the admin confirms "still a student"
-- and cross-checks the matric number against the portal screenshot manually.
-- User.level is legacy cruft from an earlier build and is not displayed
-- anywhere — dropping the column so the app cannot store or surface it.
ALTER TABLE "User" DROP COLUMN "level";