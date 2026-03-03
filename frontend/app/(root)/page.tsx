import Image from "next/image";
import { CreateTripPlanBtn, ViewTripPlansBtn } from "@/components/Buttons";

export default function Home() {
  return (
    <main className="flex relative flex-col items-center py-4 h-full gap-6 ">
      <Image
        src="/welcome.png"
        alt="Truck"
        width={800}
        height={1000}
        className="object-cover lg:h-[50vh] h-[30vh] my-4 mt-8"
      />
      <div className="flex items-center justify-center gap-5">
        <ViewTripPlansBtn />
        <CreateTripPlanBtn />
      </div>
    </main>
  );
}
