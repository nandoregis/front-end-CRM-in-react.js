import { useState, useEffect, useRef } from "react";
import Api from "../../../services/Api";
import SearchIcon from "../../../components/svg/SearchIcon";
import { useToast } from "../../../context/ToastContext";
import Carrinho from "./Carrinho";
import Busca from "./Busca";

const PAGAMENTOS = [
  { id: "dinheiro", label: "Dinheiro" },
  { id: "credito",  label: "Crédito"  },
  { id: "debito",   label: "Débito"   },
  { id: "pix",      label: "PIX"      },
];


const Caixa = ({ sale }) => {

  const [ produto, setProduto ] = useState([]);
  const [ carrinho, setCarrinho] = useState([]);

  const produtoSelecionado = (item) => {
    setProduto(item);
  }

  const produtoDoCarrinho = (item) => {
    setCarrinho(item);
  }

  return (
    <div className="p-5 flex flex-col lg:flex-row gap-5">

      {/* ── Coluna esquerda: busca + carrinho ─────────────────────────────── */}
      <div className="flex flex-col gap-4 flex-1">

        <Busca produtoSelecionado={produtoSelecionado} produtoDoCarrinho={produtoDoCarrinho}/>

        {/* <Carrinho/> */}


      </div>

      {/* ── Coluna direita: pagamento + resumo ────────────────────────────── */}
    

    </div>
  );
};

export default Caixa;