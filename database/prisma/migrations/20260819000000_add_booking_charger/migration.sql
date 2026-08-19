-- AlterTable
ALTER TABLE "Booking" ADD COLUMN "chargerId" TEXT;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_chargerId_fkey" FOREIGN KEY ("chargerId") REFERENCES "Charger"("id") ON DELETE SET NULL ON UPDATE CASCADE;
