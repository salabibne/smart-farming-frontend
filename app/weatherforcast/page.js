import Image from "next/image";
import bell from "../../public/bell.png"



const page = () => {
  return (
    // Parent Div flex
    <div className="border-2 border-[#6BBF59] px-4 rounded-2xl bg-[#6BBF59]/50  min-h-12 flex justify-between items-center ">
      {/* Text Content */}
      <div className="flex gap-4 p-2 max-w-3/4  ml-7 items-center ">
        <Image src={bell} alt="bell" width={15} height={15} />
        <p className="font-semibold text-sm py-2">
          Weather is clear and suitable for all farming activities — a perfect
          time to work your fields!
        </p>
      </div>
      {/* Time */}
      <div className="flex flex-col py-2 text-right text-sm font-semibold  mr-20">
        <p className="">10:00 AM</p>
        <p>26 May,2025</p>
      </div>
    </div>
  );
};

export default page;
