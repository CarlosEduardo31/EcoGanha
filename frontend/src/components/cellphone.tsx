import Image from "next/image";

export function Cellphone() {
  return (
    <div className="h-[55vh] sm:h-[70vh] flex items-center  relative">
      {/* Celular centralizado com breakpoints de largura */}
      <div className="z-10 flex items-center justify-center absolute inset-0">
        <Image
          src="/celular.svg"
          alt="Celular"
          width={1000}
          height={1000}
          className="w-[50vh] sm:w-[65vh] md:w-[65vh] lg:w-[70vh]"
        />
      </div>

      {/* Fundo amarelo adaptável */}
      <div className="bg-[#FBCA27] h-[15vh] sm:h-[20vh] w-[30vh] sm:w-[0vh] md:w-[0vh] rounded-r-[40px] sm:rounded-r-[60px] md:rounded-r-[70px]"></div>
    </div>
  );
}
