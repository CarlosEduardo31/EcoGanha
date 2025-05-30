// import Link from "next/link";

// export function Cadastre() {
//   return (
//     <div className="p-4 text-center">
//       <h1 className="text-[#003f25] text-lg md:text-xl lg:text-2xl font-semibold font-poppins">
//         Transforme lixo em luxo com <br />
//         nossos eco-descontos
//       </h1>
//       <Link
//         href="https://forms.gle/5HM82LqcQ9cgCJA56"
//         className="inline-block mt-4 bg-[#003f25] text-white font-semibold rounded-lg px-6 py-2 text-sm md:text-base hover:bg-[#005c38] transition"
//       >
//         Cadastre-se
//       </Link>
//     </div>
//   );
// }

import Link from "next/link";

export function Cadastre() {
  return (
    <div className="p-4 text-center flex items-center justify-center flex-col">
      <h1 className="text-[#003f25] text-base sm:text-lg md:text-xl lg:text-2xl font-semibold font-poppins">
        Transforme lixo em luxo com <br />
        nossos eco-descontos
      </h1>
      <Link
        href="https://forms.gle/5HM82LqcQ9cgCJA56"
        className="inline-block mt-4 bg-[#003f25] text-white font-semibold rounded-lg px-5 py-2 text-sm sm:text-base md:px-6 md:py-3 hover:bg-[#005c38] transition"
      >
        Cadastre-se
      </Link>
    </div>
  );
}
