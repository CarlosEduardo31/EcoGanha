import { PerfilPontos } from "@/components/PerfilPontos";
import { Parceiros } from "@/components/parceiros";
import { Descontos } from "@/components/descontos";
import { Ensino } from "@/components/Ensino";

export default function TelaPremios() {
  return (
    <main>
      <PerfilPontos></PerfilPontos>
      <Parceiros></Parceiros>
      <Descontos></Descontos>
      <Ensino></Ensino>
    </main>
  );
}
