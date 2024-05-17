import Image from "next/image";

export function Cellphone() {
  return (
    <div className=" h-[50vh] flex items-center relative">
      <div className="z-[10] flex items-center justify-center absolute w-full">
        <Image src={"/celular.svg"} alt="Celular" height={1000} width={1000} className="w-[40vh]"></Image>
      </div>
      <div className="bg-[#FBCA27] h-[20vh] w-[40vh] rounded-r-[70px]"></div>
    </div>
  );
}
