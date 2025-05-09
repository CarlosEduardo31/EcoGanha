// import type { Metadata } from "next";
// import { Poppins } from "next/font/google";
// import "./globals.css";

// const poppins = Poppins({ subsets: ["latin"],weight:["300", "400","600","700"] });

// export const metadata: Metadata = {
//   title: "EcoGanha",
//   description: "",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={poppins.className}>{children}</body>
//     </html>
//   );
// }


// src/app/layout.tsx (Server Component)
import { ClientLayout } from '../components/ClientLayout';
import './globals.css';

export const metadata = {
  title: 'EcoGanha - São João de Caruaru',
  description: 'Transforme lixo em luxo com nossos eco-descontos',
  manifest: '/manifest.json',
  themeColor: '#003F25',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'EcoGanha',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}