import Image from "next/image";

export function Parceiros() {
  const UrlsImagesParceiros = [
    "/IconBoticario.svg",
    "/IconIfood.svg",
    "/IconAssai.svg",
    "/IconClaro.svg",
  ];
  return (
    <div className="mt-[5vh]">
        <h1 className="pl-[2vh] text-[2vh] text-[poppins] text-[#003F25] font-[600] mb-[2vh]">Parceiros</h1>
      <div className="flex justify-around">
        {UrlsImagesParceiros.map((url, index) => (
          <Image
            key={index}
            src={url}
            alt={`Parceiro ${index}`}
            width={200}
            height={200}
            className="w-[9vh]"
          />
        ))}
      </div>
    </div>
  );
}
