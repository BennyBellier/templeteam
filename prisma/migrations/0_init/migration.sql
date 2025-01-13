-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Developer', 'Treasurer', 'President', 'Secretary', 'Member', 'Guest');

-- CreateEnum
CREATE TYPE "BlogCategory" AS ENUM ('ALL', 'ARTICLE', 'EVENT', 'INFORMATION');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('Create', 'Modify', 'Delete');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('Transfer', 'Cheque', 'Card');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'Member',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "YoutubeVideos" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YoutubeVideos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPosts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "thumbnail" TEXT,
    "published" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "readTime" INTEGER,
    "extraLink" TEXT,
    "category" "BlogCategory" NOT NULL,

    CONSTRAINT "BlogPosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferenceCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ReferenceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "References" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT,
    "href" TEXT,
    "alt" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "References_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMembers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nickname" TEXT,
    "imagePath" TEXT,
    "imageAlt" TEXT,

    CONSTRAINT "TeamMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMembersVideo" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "teamMembersId" TEXT,

    CONSTRAINT "TeamMembersVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMembersSkill" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "percent" INTEGER NOT NULL,
    "teamMembersId" TEXT,

    CONSTRAINT "TeamMembersSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "author" TEXT NOT NULL,
    "authorLink" TEXT,

    CONSTRAINT "Photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "mail" TEXT,
    "phone" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "photo" TEXT,
    "medicalComment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegalGuardian" (
    "id" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "mail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LegalGuardian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "year" TIMESTAMP(3) NOT NULL,
    "medicalCertificate" TEXT,
    "paymentMethod" "PaymentMethod",
    "paymentDetails" TEXT,
    "paymentAmout" DOUBLE PRECISION,
    "undersigner" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 180.00,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "startHour" TIMESTAMP(3) NOT NULL,
    "endHour" TIMESTAMP(3) NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "History" (
    "id" TEXT NOT NULL,
    "action" "ActionType" NOT NULL,
    "data" JSONB NOT NULL,
    "dateAction" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "memberId" TEXT,
    "legalGuardianId" TEXT,
    "fileId" TEXT,
    "courseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MemberLegalGuardian" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MemberLegalGuardian_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_FileCourses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FileCourses_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPosts_title_published_key" ON "BlogPosts"("title", "published");

-- CreateIndex
CREATE UNIQUE INDEX "References_id_name_key" ON "References"("id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMembers_name_key" ON "TeamMembers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMembers_imagePath_key" ON "TeamMembers"("imagePath");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMembersVideo_path_key" ON "TeamMembersVideo"("path");

-- CreateIndex
CREATE UNIQUE INDEX "Photos_src_key" ON "Photos"("src");

-- CreateIndex
CREATE UNIQUE INDEX "Member_mail_key" ON "Member"("mail");

-- CreateIndex
CREATE UNIQUE INDEX "Member_phone_key" ON "Member"("phone");

-- CreateIndex
CREATE INDEX "Member_lastname_firstname_birthdate_idx" ON "Member"("lastname", "firstname", "birthdate");

-- CreateIndex
CREATE INDEX "Member_gender_idx" ON "Member"("gender");

-- CreateIndex
CREATE INDEX "Member_address_city_postalCode_country_idx" ON "Member"("address", "city", "postalCode", "country");

-- CreateIndex
CREATE UNIQUE INDEX "Member_lastname_firstname_birthdate_key" ON "Member"("lastname" ASC, "firstname" ASC, "birthdate");

-- CreateIndex
CREATE UNIQUE INDEX "LegalGuardian_phone_key" ON "LegalGuardian"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "LegalGuardian_mail_key" ON "LegalGuardian"("mail");

-- CreateIndex
CREATE INDEX "LegalGuardian_lastname_firstname_idx" ON "LegalGuardian"("lastname", "firstname");

-- CreateIndex
CREATE INDEX "LegalGuardian_mail_idx" ON "LegalGuardian"("mail");

-- CreateIndex
CREATE INDEX "LegalGuardian_phone_idx" ON "LegalGuardian"("phone");

-- CreateIndex
CREATE INDEX "File_memberId_idx" ON "File"("memberId");

-- CreateIndex
CREATE INDEX "File_year_memberId_idx" ON "File"("year", "memberId");

-- CreateIndex
CREATE INDEX "File_paymentMethod_idx" ON "File"("paymentMethod");

-- CreateIndex
CREATE INDEX "File_createdAt_idx" ON "File"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "File_year_memberId_key" ON "File"("year" DESC, "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_key" ON "Course"("name");

-- CreateIndex
CREATE INDEX "Course_name_idx" ON "Course"("name");

-- CreateIndex
CREATE INDEX "Course_price_idx" ON "Course"("price" ASC);

-- CreateIndex
CREATE INDEX "Schedule_dayOfWeek_idx" ON "Schedule"("dayOfWeek");

-- CreateIndex
CREATE INDEX "Schedule_startHour_idx" ON "Schedule"("startHour");

-- CreateIndex
CREATE INDEX "Schedule_endHour_idx" ON "Schedule"("endHour");

-- CreateIndex
CREATE INDEX "Schedule_courseId_dayOfWeek_idx" ON "Schedule"("courseId", "dayOfWeek");

-- CreateIndex
CREATE INDEX "History_action_dateAction_idx" ON "History"("action", "dateAction");

-- CreateIndex
CREATE INDEX "History_memberId_action_idx" ON "History"("memberId", "action");

-- CreateIndex
CREATE INDEX "History_legalGuardianId_action_idx" ON "History"("legalGuardianId", "action");

-- CreateIndex
CREATE INDEX "History_fileId_action_idx" ON "History"("fileId", "action");

-- CreateIndex
CREATE INDEX "History_courseId_action_idx" ON "History"("courseId", "action");

-- CreateIndex
CREATE INDEX "_MemberLegalGuardian_B_index" ON "_MemberLegalGuardian"("B");

-- CreateIndex
CREATE INDEX "_FileCourses_B_index" ON "_FileCourses"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "References" ADD CONSTRAINT "References_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ReferenceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMembersVideo" ADD CONSTRAINT "TeamMembersVideo_teamMembersId_fkey" FOREIGN KEY ("teamMembersId") REFERENCES "TeamMembers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMembersSkill" ADD CONSTRAINT "TeamMembersSkill_teamMembersId_fkey" FOREIGN KEY ("teamMembersId") REFERENCES "TeamMembers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_legalGuardianId_fkey" FOREIGN KEY ("legalGuardianId") REFERENCES "LegalGuardian"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemberLegalGuardian" ADD CONSTRAINT "_MemberLegalGuardian_A_fkey" FOREIGN KEY ("A") REFERENCES "LegalGuardian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemberLegalGuardian" ADD CONSTRAINT "_MemberLegalGuardian_B_fkey" FOREIGN KEY ("B") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileCourses" ADD CONSTRAINT "_FileCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileCourses" ADD CONSTRAINT "_FileCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

