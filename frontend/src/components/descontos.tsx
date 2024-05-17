import Image from "next/image";

export function Descontos() {
  return (
    <div className="mt-[2vh] ">
      <h1 className="pl-[2vh] text-[2vh] text-[poppins] text-[#003F25] font-[600] mb-[2vh]">
        Descontos na Hora
      </h1>

      <div className="flex justify-center items-center ">
        <div className="bg-[#D9D9D9] w-[90%] flex justify-center items-center rounded-lg shadow-[-10px_10px_10px_2px_rgba(0,0,0,0.2)]
        p-[2vh]">
          <Image
            src={"descontoEletrolux.svg"}
            alt="ImageDesconto"
            height={1000}
            width={1000}
            className="w-[95%]"
          ></Image>
          <button></button>
        </div>
      </div>
    </div>
  );
}
