-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);
