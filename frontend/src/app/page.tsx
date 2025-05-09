import { Cellphone } from "@/components/cellphone";
import { Header } from "@/components/header";
import { Cadastre } from "@/components/cadastre";
import { Content } from "@/components/content";
import { Carrossel } from "@/components/carrossel";
import { Convite } from "@/components/convite";
import { Footer } from "@/components/footer";
import "@fontsource/poppins";

export default function Home() {
  return (
    <main className="">
      <Header></Header>
      <Cellphone></Cellphone>
      <Cadastre></Cadastre>
      <Content></Content>
      <Carrossel></Carrossel>
      <Convite></Convite>
      <Footer></Footer>
    </main>
  );
}
