import Image from "next/image";

export function Header() {
  return (
    <div className="w-full h-[10vh]">
      <div className="bg-[#FBCA27] w-full h-[10vh] flex justify-around items-center shadow-sm fixed z-[14]">
        <button>
          <Image
            alt="Menu"
            height={100}
            width={100}
            src={"/menu-svgrepo-com (2).svg"}
            className="w-[3vh]"
          ></Image>
        </button>
        <Image
          alt="Menu"
          height={1000}
          width={1000}
          src={"/logoSVG.svg"}
          className="w-[8vh]"
        ></Image>
        <button>
          <Image
            alt="Menu"
            height={1000}
            width={1000}
            src={"/buttonSVG.svg"}
            className="w-[8vh] drop-shadow"
          ></Image>
        </button>
      </div>
    </div>
  );
}
