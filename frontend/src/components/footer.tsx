import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#003F25] text-white py-6 sm:py-8 md:py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-center text-xl sm:text-2xl font-semibold mb-2">EcoGanha</h1>
        <p className="text-center flex justify-center flex-col sm:flex-row text-sm sm:text-base">
          <span>Feito com amor em Caruaru</span>
          <span className="hidden sm:inline mx-2">•</span>
          <span>para o São João</span>
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <a href="#" className="transition-transform hover:scale-110">
            <Image
              src={"/instagram.svg"}
              alt="Instagram"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </a>
          <a href="#" className="transition-transform hover:scale-110">
            <Image
              src={"/facebook.svg"}
              alt="Facebook"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}