import Image from "next/image"

export function Ensino(){
    const UrlsImagesCursos = ["/ImageCurso1.svg", "/ImageCurso2.svg"]
    return(
        <div className="mt-[4vh]">
            <h1 className="pl-[2vh] text-[2vh] text-[poppins] text-[#003F25] font-[600] mb-[2vh]">Como Separar</h1>
            <div className="flex justify-around">
            {UrlsImagesCursos.map((url, index) => (
          <Image
            key={index}
            src={url}
            alt={`Curso ${index}`}
            width={200}
            height={200}
            className="w-[17vh]"
          />
        ))}
            </div>
        </div>
    )
}