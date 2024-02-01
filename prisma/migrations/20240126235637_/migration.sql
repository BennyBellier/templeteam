-- CreateTable
CREATE TABLE "References" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "img" TEXT NOT NULL,
    "href" VARCHAR(256) NOT NULL,
    "alt" VARCHAR(64) NOT NULL,

    CONSTRAINT "References_pkey" PRIMARY KEY ("id")
);
