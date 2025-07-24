/*
  Warnings:

  - The `last_read_message_id` column on the `chat_members` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `messages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `messages` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `reply_to_message_id` column on the `messages` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "chat_members" DROP CONSTRAINT "chat_members_last_read_message_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_reply_to_message_id_fkey";

-- AlterTable
ALTER TABLE "chat_members" DROP COLUMN "last_read_message_id",
ADD COLUMN     "last_read_message_id" INTEGER;

-- AlterTable
ALTER TABLE "messages" DROP CONSTRAINT "messages_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "reply_to_message_id",
ADD COLUMN     "reply_to_message_id" INTEGER,
ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "chat_members" ADD CONSTRAINT "chat_members_last_read_message_id_fkey" FOREIGN KEY ("last_read_message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_reply_to_message_id_fkey" FOREIGN KEY ("reply_to_message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
