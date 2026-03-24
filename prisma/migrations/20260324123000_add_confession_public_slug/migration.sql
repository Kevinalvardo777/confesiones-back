ALTER TABLE "Confession"
ADD COLUMN "publicSlug" TEXT;

UPDATE "Confession"
SET "publicSlug" = lower(
  trim(
    both '-' from regexp_replace(
      regexp_replace(
        coalesce(nullif("alias", ''), 'confesion'),
        '[^a-zA-Z0-9]+',
        '-',
        'g'
      ),
      '-+',
      '-',
      'g'
    )
  )
) || '-' || right("id", 6)
WHERE "publicSlug" IS NULL;

ALTER TABLE "Confession"
ALTER COLUMN "publicSlug" SET NOT NULL;

CREATE UNIQUE INDEX "Confession_publicSlug_key" ON "Confession"("publicSlug");
