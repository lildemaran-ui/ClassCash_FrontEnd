import Footer from "../../../components/Footer/footer";
import Nav from "../../../components/Menu/Menu";
import ConteudoIndex from "./ConteudoIndex";

export default function PaginaInicial() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden  ">
      <Nav />

      <ConteudoIndex/>

      <Footer />
    </div>
  );
}
