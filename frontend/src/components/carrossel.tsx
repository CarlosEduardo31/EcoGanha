import Image from "next/image";

export function Carrossel() {
  return (
    <div className="w-full h-max my-[3vh]">
      <h1 className="text-[poppins] text-center mb-[3vh]">Benefícios da Iniciativa</h1>
      <div className="pl-[2vh]">
        <Image
          src="/ImageCarrossel1.svg"
          className="w-full rounded-l-lg"
          alt="Carousel item 1"
          width={1000}
          height={1000}
        ></Image>
      </div>
    </div>
  );
}
