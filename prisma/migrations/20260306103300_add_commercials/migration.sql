-- CreateTable
CREATE TABLE "commercials" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "position" TEXT NOT NULL DEFAULT '',
    "phone" TEXT,
    "email" TEXT,
    "photo_url" TEXT,
    "bio" TEXT DEFAULT '',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commercials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "commercials_profile_id_idx" ON "commercials"("profile_id");

-- AddForeignKey
ALTER TABLE "commercials" ADD CONSTRAINT "commercials_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
