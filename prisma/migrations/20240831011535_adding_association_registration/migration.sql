-- CreateEnum
CREATE TYPE "BlogCategory" AS ENUM ('ALL', 'ARTICLE', 'EVENT', 'INFORMATION');

-- CreateEnum
CREATE TYPE "Membership" AS ENUM ('templeRun', 'templeGym', 'templeBreak', 'templeGymJunior');

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
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "mail" TEXT,
    "phoneNumber" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "picture" TEXT NOT NULL,
    "medicalComment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmergencyContact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmergencyContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberEmergencyContact" (
    "id" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "memberId" TEXT NOT NULL,
    "emergencyContactId" TEXT NOT NULL,

    CONSTRAINT "MemberEmergencyContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberMembership" (
    "id" TEXT NOT NULL,
    "membership" "Membership" NOT NULL,
    "memberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberMembership_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "Member_firstname_lastname_birthdate_key" ON "Member"("firstname", "lastname", "birthdate");

-- CreateIndex
CREATE UNIQUE INDEX "EmergencyContact_phone_key" ON "EmergencyContact"("phone");

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
ALTER TABLE "MemberEmergencyContact" ADD CONSTRAINT "MemberEmergencyContact_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberEmergencyContact" ADD CONSTRAINT "MemberEmergencyContact_emergencyContactId_fkey" FOREIGN KEY ("emergencyContactId") REFERENCES "EmergencyContact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberMembership" ADD CONSTRAINT "MemberMembership_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
