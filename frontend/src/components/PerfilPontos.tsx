import Image from "next/image";

export function PerfilPontos() {
  return (
    <div className="text-[poppins]">
      <div className="flex items-center justify-center mt-[4vh]">
        <Image
          src={"/IconPerfil.svg"}
          alt="Perfil"
          height={100}
          width={100}
        ></Image>
      </div>
      <h1 className="text-[#656363] font-[500] text-center">2.000 EcoPontos</h1>
      <h1 className="text-[#003E25] font-[600] text-center">Vandilma Candido </h1>
    </div>
    
  );
}
