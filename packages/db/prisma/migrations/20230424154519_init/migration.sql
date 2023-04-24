-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'PRO', 'PRO_PLUS', 'BIG_DECK_ENERGY', 'EDITOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "AppType" AS ENUM ('GAME', 'APP', 'TOOL', 'MOD', 'EMULATOR', 'BOOT_VIDEO');

-- CreateEnum
CREATE TYPE "AppStatus" AS ENUM ('PUBLISHED', 'HIDDEN', 'BETA', 'ALPHA', 'DEV', 'PREVIEW', 'PERSONAL', 'IN_REVIEW', 'DRAFT', 'REJECTED', 'DELETED');

-- CreateEnum
CREATE TYPE "AppStore" AS ENUM ('STEAM', 'GOG', 'EPIC', 'ORIGIN', 'UPLAY', 'FLATPAK', 'SNAP', 'PACMAN', 'OTHER');

-- CreateEnum
CREATE TYPE "AppRunnerType" AS ENUM ('EXE', 'MSI', 'DMG', 'DEB', 'RPM', 'WEB', 'FLATPAK', 'APPIMAGE', 'UNKNOWN', 'BASH');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('WINDOWS', 'LINUX', 'STEAMOS', 'MAC', 'ANDROID', 'IOS', 'WEB', 'OTHER');

-- CreateEnum
CREATE TYPE "MediaSteamType" AS ENUM ('COVER', 'ICON', 'BANNER', 'OTHER');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "BootVideoType" AS ENUM ('STEAM_BOOT', 'STEAM_SUSPEND');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "username" TEXT,
    "image" TEXT,
    "bio" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserActionApp" (
    "userId" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "recentAt" TIMESTAMP(3),
    "favoritedAt" TIMESTAMP(3),
    "hideAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserActionApp_pkey" PRIMARY KEY ("userId","appId")
);

-- CreateTable
CREATE TABLE "UserAppPlatform" (
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL DEFAULT 'OTHER',
    "installedAt" TIMESTAMP(3),
    "runningAt" TIMESTAMP(3),
    "updatingAt" TIMESTAMP(3),
    "addedToSteamAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAppPlatform_pkey" PRIMARY KEY ("userId","platform")
);

-- CreateTable
CREATE TABLE "Launcher" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "iconUrl" TEXT,
    "coverUrl" TEXT,
    "company" TEXT,
    "companyUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "AppStatus" NOT NULL DEFAULT 'DRAFT',
    "typeAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT NOT NULL DEFAULT 'Games',

    CONSTRAINT "Launcher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLauncherCredential" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "launcherId" TEXT NOT NULL,
    "expires_in" INTEGER,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "user_id" TEXT,
    "loginTime" INTEGER,
    "error" TEXT,
    "username" TEXT,
    "password" TEXT,

    CONSTRAINT "UserLauncherCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppVersion" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '0.0.0',
    "sourceUrl" TEXT NOT NULL,
    "name" TEXT,
    "uninstallUrl" TEXT,
    "appId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "size" INTEGER NOT NULL DEFAULT 0,
    "sha256" TEXT,
    "store" "AppStore",
    "storeUrl" TEXT,
    "platform" "Platform" NOT NULL DEFAULT 'OTHER',
    "runnerType" "AppRunnerType" NOT NULL DEFAULT 'UNKNOWN',
    "installLocation" TEXT,
    "runnerLocation" TEXT,
    "saveLocation" TEXT,
    "isRecommended" BOOLEAN NOT NULL DEFAULT false,
    "status" "AppStatus" NOT NULL DEFAULT 'DRAFT',
    "changelog" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "type" "MediaType" NOT NULL DEFAULT 'OTHER',
    "steamType" "MediaSteamType" NOT NULL DEFAULT 'OTHER',
    "appId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppMedia" (
    "mediaId" TEXT NOT NULL,
    "appId" TEXT NOT NULL,

    CONSTRAINT "AppMedia_pkey" PRIMARY KEY ("mediaId","appId")
);

-- CreateTable
CREATE TABLE "App" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "description" TEXT,
    "iconUrl" TEXT,
    "coverUrl" TEXT,
    "authorName" TEXT,
    "authorUrl" TEXT,
    "publisherName" TEXT,
    "publisherUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT,
    "type" "AppStatus" DEFAULT 'DRAFT',
    "typeAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT DEFAULT 'Entertainment',
    "subCategory" TEXT DEFAULT 'Other',
    "sourceUrl" TEXT,
    "uninstallUrl" TEXT,
    "sha256" TEXT,
    "store" "AppStore",
    "storeUrl" TEXT,
    "platform" "Platform" NOT NULL DEFAULT 'OTHER',
    "runnerType" "AppRunnerType" NOT NULL DEFAULT 'UNKNOWN',
    "installLocation" TEXT,
    "runnerLocation" TEXT,
    "saveLocation" TEXT,

    CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootVideo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "authorName" TEXT,
    "authorUrl" TEXT,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "size" INTEGER NOT NULL DEFAULT 0,
    "isBootVideo" BOOLEAN NOT NULL DEFAULT true,
    "isSuspendVideo" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,

    CONSTRAINT "BootVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameMedia" (
    "mediaId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "GameMedia_pkey" PRIMARY KEY ("mediaId","gameId")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "description" TEXT,
    "iconUrl" TEXT,
    "coverUrl" TEXT,
    "authorName" TEXT,
    "authorUrl" TEXT,
    "ownerId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "UserActionApp" ADD CONSTRAINT "UserActionApp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActionApp" ADD CONSTRAINT "UserActionApp_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAppPlatform" ADD CONSTRAINT "UserAppPlatform_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAppPlatform" ADD CONSTRAINT "UserAppPlatform_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLauncherCredential" ADD CONSTRAINT "UserLauncherCredential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLauncherCredential" ADD CONSTRAINT "UserLauncherCredential_launcherId_fkey" FOREIGN KEY ("launcherId") REFERENCES "Launcher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppVersion" ADD CONSTRAINT "AppVersion_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppMedia" ADD CONSTRAINT "AppMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppMedia" ADD CONSTRAINT "AppMedia_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "App" ADD CONSTRAINT "App_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BootVideo" ADD CONSTRAINT "BootVideo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameMedia" ADD CONSTRAINT "GameMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameMedia" ADD CONSTRAINT "GameMedia_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
