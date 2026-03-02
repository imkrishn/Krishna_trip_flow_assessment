import Image from "next/image";
import { CreateTripPlanBtn, ViewTripPlansBtn } from "@/components/Buttons";

export default function Home() {
  return (
    <main className="flex flex-col items-center py-4 h-full gap-6 ">
      <Image
        src="/welcome.png"
        alt="Truck"
        width={700}
        height={800}
        className="object-cover lg:h-[40vh] my-4 lg:mt-8"
      />
      <div className="flex items-center justify-center gap-5">
        <ViewTripPlansBtn />
        <CreateTripPlanBtn />
      </div>
    </main>
  );
}
