-- CreateEnum
CREATE TYPE "EnumUser" AS ENUM ('USER', 'TEACHER', 'ADMIN');

-- CreateEnum
CREATE TYPE "EnumBookingStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'OTHER');

-- CreateEnum
CREATE TYPE "EnumRoomStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "lineIdUser" TEXT NOT NULL,
    "lineName" TEXT NOT NULL,
    "name" TEXT,
    "lastname" TEXT,
    "imageUrl" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "role" "EnumUser" NOT NULL DEFAULT 'USER',
    "updatedat" TIMESTAMP(3) NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parentId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "subroom" TEXT,
    "status" "EnumRoomStatus" NOT NULL DEFAULT 'AVAILABLE',
    "updatedat" TIMESTAMP(3) NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "roomId" INTEGER,
    "note" TEXT NOT NULL,
    "status" "EnumBookingStatus" NOT NULL DEFAULT 'ACTIVE',
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "updatedat" TIMESTAMP(3) NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStudy" (
    "id" SERIAL NOT NULL,
    "bookingId" TEXT NOT NULL,
    "userId" INTEGER,
    "updatedat" TIMESTAMP(3) NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserStudy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionStudent" (
    "id" SERIAL NOT NULL,
    "teacherName" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "timeSlotId" INTEGER NOT NULL,
    "roomname" TEXT NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionTeacher" (
    "id" SERIAL NOT NULL,
    "name" INTEGER NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "timeSlotId" INTEGER NOT NULL,
    "roomname" TEXT NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionTeacher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_lineIdUser_key" ON "User"("lineIdUser");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStudy" ADD CONSTRAINT "UserStudy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStudy" ADD CONSTRAINT "UserStudy_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
