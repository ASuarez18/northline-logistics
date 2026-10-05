-- This is an empty migration.
CREATE UNIQUE INDEX "Shift_one_open_per_user"
ON "Shift" ("userId")
WHERE "clockOut" IS NULL;