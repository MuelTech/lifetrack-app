-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "MealQuality" AS ENUM ('BALANCED', 'JUNK', 'SKIPPED');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('WALK', 'GYM', 'SPORTS', 'NONE');

-- CreateEnum
CREATE TYPE "StressLevel" AS ENUM ('LOW', 'MODERATE', 'HIGH');

-- CreateEnum
CREATE TYPE "LifestyleStatus" AS ENUM ('BALANCED', 'NEEDS_IMPROVEMENT', 'UNHEALTHY_PATTERN_DETECTED');

-- CreateEnum
CREATE TYPE "ArticleCategory" AS ENUM ('NUTRITION', 'SLEEP_HYGIENE', 'STRESS_MANAGEMENT', 'EXERCISE', 'EARLY_SIGNS');

-- CreateTable
CREATE TABLE "Profile" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "yearLevel" TEXT NOT NULL,
    "section" TEXT,
    "age" INTEGER NOT NULL,
    "sex" "Sex" NOT NULL,
    "healthConcerns" TEXT[],
    "pushToken" TEXT,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "sleptAt" TIMESTAMP(3) NOT NULL,
    "wokeUp" TIMESTAMP(3) NOT NULL,
    "sleepHours" DOUBLE PRECISION NOT NULL,
    "breakfast" "MealQuality" NOT NULL,
    "lunch" "MealQuality" NOT NULL,
    "dinner" "MealQuality" NOT NULL,
    "waterCups" INTEGER NOT NULL,
    "activityDuration" INTEGER NOT NULL,
    "activityType" "ActivityType"[],
    "studyHours" DOUBLE PRECISION NOT NULL,
    "screenTimeHours" DOUBLE PRECISION NOT NULL,
    "stressLevel" "StressLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatternResult" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "logId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "lifestyleStatus" "LifestyleStatus" NOT NULL,
    "activePatterns" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatternResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "category" "ArticleCategory" NOT NULL,
    "preview" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "readTime" INTEGER NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Log_userId_date_key" ON "Log"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "PatternResult_logId_key" ON "PatternResult"("logId");

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatternResult" ADD CONSTRAINT "PatternResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatternResult" ADD CONSTRAINT "PatternResult_logId_fkey" FOREIGN KEY ("logId") REFERENCES "Log"("id") ON DELETE CASCADE ON UPDATE CASCADE;
