import { useEffect, useState } from "react";
import Api from "../../../services/Api";
import Cart from "./Cart";
import Payment from "./Payment";
import Summary from "./Summary";
import ProductSearch from "./ProductSearch";

const Caixa = ({ sale }) => {

  // ─── busca ────────────────────────────────────────────────────────────────
  const [termo, setTermo]                   = useState("");
  const [sugestoes, setSugestoes]           = useState([]);
  const [buscando, setBuscando]             = useState(false);
  const [dropdownAberto, setDropdownAberto] = useState(false);

  // ─── produto selecionado ──────────────────────────────────────────────────
  const [produto, setProduto]                       = useState(null);
  const [carregandoProduto, setCarregandoProduto]   = useState(false);
  const [varianteUuid, setVarianteUuid]             = useState("");
  const [quantidade, setQuantidade]                 = useState(1);

  // ─── carrinho ─────────────────────────────────────────────────────────────
  const [carrinho, setCarrinho] = useState([]);

  // ─── pagamento ────────────────────────────────────────────────────────────
  const [pagamento, setPagamento] = useState("dinheiro");
  const [desconto, setDesconto]   = useState("");

  // ─── envio ────────────────────────────────────────────────────────────────
  const [finalizando, setFinalizando] = useState(false);
  const [erro, setErro]               = useState(null);
  const [sucesso, setSucesso]         = useState(false);

  // ─── totais ───────────────────────────────────────────────────────────────
  const subtotal    = carrinho.reduce((a, i) => a + i.preco * i.quantidade, 0);
  const descontoVal = parseFloat(desconto) || 0;
  const total       = Math.max(subtotal - descontoVal, 0);

  const addProdutoNoDB = async (produto, variante, quantidade) => {
   
    try {
      const res = await Api.post('/v1/sales/itens/c/create', {
        sale_uuid: sale.uuid,
        product_uuid: produto.uuid,
        variations: [
          {
            variation_uuid: variante.uuid,
            quantity: quantidade,
            price: variante.price.replace('.',',')
          }
        ]
      });

    } catch (err) {
      console.log(err.response);
    }
  }

   useEffect(() => {
    const loadItemsSale = async () => 
    { 
      
      try {
        const res = await Api.get(`/v1/sales/items/${sale.uuid}`);
        const items = res.data.data;
        console.log(items);

        items.forEach( item => {

            const chave = `${item.product_uuid}-${item.variation_uuid}`;

            setCarrinho((prev) => {
              const existe = prev.find((i) => i.chave === chave);
              if (existe) {
                return prev.map((i) =>
                  i.chave === chave ? { ...i, quantidade: i.quantidade } : i
                );
              }

              return [
                ...prev,
                {
                  chave,
                  produto_uuid:  item?.product_uuid,
                  variante_uuid: item?.variation_uuid,
                  nome:    item?.product_name,
                  cor:     item?.color_name,
                  cor_hex: item?.color_hex,
                  tamanho: item?.size_name,
                  preco:   item?.price || "0.00",
                  quantidade: item?.quantity
                },
              ];
            }); 
        });
    
      } catch (err) {
        console.log(err.response);
      }
    }

    loadItemsSale();
  }, []);

  // ─── adicionar ao carrinho ────────────────────────────────────────────────
  const adicionarAoCarrinho = () => {
    if (!produto || !varianteUuid) return;
    const variante = produto.variations?.find((v) => v.uuid === varianteUuid);
    if (!variante) return;

    const chave = `${produto.uuid}-${varianteUuid}`;
    var quantity = quantidade;

    setCarrinho((prev) => {
      const existe = prev.find((i) => i.chave === chave);
      console.log(existe);
      if (existe) {
        quantity = Number(existe.quantidade) + quantidade;
        return prev.map((i) =>
          i.chave === chave ? { ...i, quantidade: Number(i.quantidade) + quantidade } : i
        );
      }

      return [
        ...prev,
        {
          chave,
          produto_uuid:  produto.uuid,
          variante_uuid: varianteUuid,
          nome:    produto.name,
          cor:     variante.color_name,
          cor_hex: variante.color_hex,
          tamanho: variante.size_name,
          preco:   variante.price || "0.00",
          quantidade,
        },
      ];
    }); 

    addProdutoNoDB(produto, variante, quantity);

    limparStates();
  };

 

  // ─── alterar quantidade ───────────────────────────────────────────────────
  const alterarQtd = (chave, val) => {
    const n = parseInt(val);
    if (n < 1) return;

    const item = carrinho.find((i) => i.chave === chave);
    if (!item) return;

    const payloadProduto = {
      uuid : item.produto_uuid,
      name : item.nome
    }

    const payloadVariante = {
      uuid : item.variante_uuid,
      price : item.preco
    }
    
    addProdutoNoDB(payloadProduto, payloadVariante, n);

    setCarrinho((p) =>
      p.map((i) => (i.chave === chave ? { ...i, quantidade: n } : i))
    );


  };

  const limparStates = () => {
    setProduto(null);
    setTermo("");
    setSugestoes([]);
    setVarianteUuid("");
    setQuantidade(1);
    setDropdownAberto(false);
  }

  // ─── remover item ─────────────────────────────────────────────────────────

  const removerItem = async (chave) => {
    const produtoRemove = carrinho.find((i) => i.chave === chave);
    if (!produtoRemove) return;

    console.log(produtoRemove)

    try {
      const res = await Api.delete(`/v1/sales/itens/d/delete/${produtoRemove.variante_uuid}`);
      console.log(res.data.data);
      setCarrinho((p) => p.filter((i) => i.chave !== chave));
    } catch (err) {
      const errorMessage = err.response?.data?.message;
      console.log(errorMessage);
    }    
  }

  const removerTodosItens = async () => {
    try {
      const res = await Api.delete(`/v1/sales/itens/all/d/delete/sale/${sale.uuid}`);
      setCarrinho([]);
    } catch (err) {
      const errorMessage = err.response?.data?.message;
      console.log(errorMessage);
    }   
  }

  //  /itens/all/d/delete/sale/ 

  // ─── finalizar venda ──────────────────────────────────────────────────────
  const finalizarVenda = async () => {
    if (!carrinho.length) return;
    setErro(null);
    setSucesso(false);
    setFinalizando(true);

    const payload = {
      payment_method: pagamento,
      discount: descontoVal,
      total,
      items: carrinho.map((i) => ({
        product_uuid:   i.produto_uuid,
        variation_uuid: i.variante_uuid,
        quantity: i.quantidade,
        price:    i.preco,
      })),
    };

    try {
      await Api.post(`/v1/sales/${sale?.uuid}/finish`, payload);
      setSucesso(true);
      setCarrinho([]);
      setDesconto("");
      setPagamento("dinheiro");
      setTimeout(() => setSucesso(false), 3000);
    } catch {
      setErro("Erro ao finalizar venda. Tente novamente.");
    } finally {
      setFinalizando(false);
    }
  };

  return (
    <div className="p-5 flex flex-col lg:flex-row gap-5">

      {/* Coluna esquerda */}
      <div className="flex-1 flex flex-col gap-4">
        <ProductSearch
          termo={termo}               setTermo={setTermo}
          sugestoes={sugestoes}       setSugestoes={setSugestoes}
          buscando={buscando}         setBuscando={setBuscando}
          dropdownAberto={dropdownAberto} setDropdownAberto={setDropdownAberto}
          produto={produto}           setProduto={setProduto}
          carregandoProduto={carregandoProduto} setCarregandoProduto={setCarregandoProduto}
          varianteUuid={varianteUuid} setVarianteUuid={setVarianteUuid}
          quantidade={quantidade}     setQuantidade={setQuantidade}
          onAdicionarAoCarrinho={adicionarAoCarrinho}
        />

        <Cart
          carrinho={carrinho}
          alterarQtd={alterarQtd}
          removerItem={removerItem}
        />
      </div>

      {/* Coluna direita */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <Payment
          pagamento={pagamento}   setPagamento={setPagamento}
          desconto={desconto}     setDesconto={setDesconto}
        />

        <Summary
          subtotal={subtotal}
          descontoVal={descontoVal}
          total={total}
          onFinalizar={finalizarVenda}
          onLimpar={removerTodosItens}
          finalizando={finalizando}
          sucesso={sucesso}
          temItens={carrinho.length > 0}
        />
      </div>

    </div>
  );
};

export default Caixa;