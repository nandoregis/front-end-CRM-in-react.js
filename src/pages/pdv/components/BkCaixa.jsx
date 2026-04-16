import { useState, useEffect, useRef } from "react";
import Api from "../../../services/Api";
import SearchIcon from "../../../components/svg/SearchIcon";

const PAGAMENTOS = [
  { id: "dinheiro", label: "Dinheiro" },
  { id: "credito",  label: "Crédito"  },
  { id: "debito",   label: "Débito"   },
  { id: "pix",      label: "PIX"      },
];

const fmt = (val) =>
  Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const CloseIcon = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const TrashIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);

const Caixa = ({ sale }) => {

  // ─── busca ────────────────────────────────────────────────────────────────
  const [termo, setTermo] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  // ─── produto selecionado ──────────────────────────────────────────────────
  const [produto, setProduto] = useState(null);
  const [carregandoProduto, setCarregandoProduto] = useState(false);
  const [varianteUuid, setVarianteUuid] = useState("");
  const [quantidade, setQuantidade] = useState(1);

  // ─── carrinho ─────────────────────────────────────────────────────────────
  const [carrinho, setCarrinho] = useState([]);

  // ─── pagamento ────────────────────────────────────────────────────────────
  const [pagamento, setPagamento] = useState("dinheiro");
  const [desconto, setDesconto] = useState("");

  // ─── envio ────────────────────────────────────────────────────────────────
  const [finalizando, setFinalizando] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);

  // ─── fecha dropdown ao clicar fora ───────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setDropdownAberto(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ─── busca com debounce ───────────────────────────────────────────────────
  useEffect(() => {
    if (!termo.trim()) {
      setSugestoes([]);
      setDropdownAberto(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setBuscando(true);
      try {
        const res = await Api.get(`/v1/produtos/reference/search/${termo.trim()}`);
        const lista = Array.isArray(res.data.data) ? res.data.data : res.data;
        setSugestoes(lista);
        setDropdownAberto(true);
      } catch {
        setSugestoes([]);
        setDropdownAberto(false);
      } finally {
        setBuscando(false);
      }
    }, 350);

    return () => clearTimeout(debounceRef.current);
  }, [termo]);

  // ─── seleciona sugestão → busca produto por uuid ─────────────────────────
  const selecionarSugestao = async (item) => {
    setDropdownAberto(false);
    setTermo(item.name ?? item.reference ?? "");
    setSugestoes([]);
    setVarianteUuid("");
    setQuantidade(1);
    setProduto(null);
    setCarregandoProduto(true);

    try {
      const res = await Api.get(`/v1/product_variations/${item.uuid}`);
      setProduto(res.data.data ?? res.data);
    } catch {
      setProduto(null);
    } finally {
      setCarregandoProduto(false);
    }
  };

  const limparBusca = () => {
    setTermo("");
    setSugestoes([]);
    setProduto(null);
    setVarianteUuid("");
    setQuantidade(1);
    setDropdownAberto(false);
  };

  // ─── carrinho ─────────────────────────────────────────────────────────────
  const adicionarAoCarrinho = () => {
    if (!produto || !varianteUuid) return;
    const variante = produto.variations?.find((v) => v.uuid === varianteUuid);
    if (!variante) return;

    const chave = `${produto.uuid}-${varianteUuid}`;
    setCarrinho((prev) => {
      const existe = prev.find((i) => i.chave === chave);
      if (existe) {
        return prev.map((i) =>
          i.chave === chave ? { ...i, quantidade: i.quantidade + quantidade } : i
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
          preco:   parseFloat(variante.price || 0),
          quantidade,
        },
      ];
    });

    limparBusca();
  };

  const removerItem = (chave) =>
    setCarrinho((p) => p.filter((i) => i.chave !== chave));

  const alterarQtd = (chave, val) => {
    const n = parseInt(val);
    if (n < 1) return;
    setCarrinho((p) =>
      p.map((i) => (i.chave === chave ? { ...i, quantidade: n } : i))
    );
  };

  // ─── totais ───────────────────────────────────────────────────────────────
  const subtotal    = carrinho.reduce((acc, i) => acc + i.preco * i.quantidade, 0);
  const descontoVal = parseFloat(desconto) || 0;
  const total       = Math.max(subtotal - descontoVal, 0);

  const varianteSelecionada = produto?.variations?.find((v) => v.uuid === varianteUuid);

  // ─── finalizar ────────────────────────────────────────────────────────────
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

      {/* ── Coluna esquerda: busca + carrinho ─────────────────────────────── */}
      <div className="flex flex-col gap-4 flex-1">

        {/* Busca */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-4">
          <p className="text-sm font-medium text-gray-700">Buscar produto</p>

          <div className="relative" ref={wrapperRef}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <SearchIcon />
              </span>
              <input
                type="text"
                value={termo}
                onChange={(e) => setTermo(e.target.value)}
                onFocus={() => sugestoes.length > 0 && setDropdownAberto(true)}
                placeholder="Digite o nome ou referência..."
                className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg
                  outline-none focus:border-blue-400 transition-colors"
              />
              {termo && (
                <button type="button" onClick={limparBusca}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                    hover:text-gray-600 transition-colors">
                  <CloseIcon />
                </button>
              )}
            </div>

            {/* Dropdown */}
            {dropdownAberto && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200
                rounded-xl shadow-lg z-50 overflow-hidden">
                {buscando ? (
                  <div className="px-4 py-3 text-sm text-gray-400">Buscando...</div>
                ) : sugestoes.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-400">Nenhum resultado.</div>
                ) : (
                  <ul className="divide-y divide-gray-50 max-h-56 overflow-y-auto">
                    {sugestoes.map((s) => (
                      <li key={s.uuid}>
                        <button type="button" onMouseDown={() => selecionarSugestao(s)}
                          className="w-full flex items-center justify-between px-4 py-3
                            hover:bg-gray-50 transition-colors text-left">
                          <span className="text-sm text-gray-900">{s.name}</span>
                          <span className="text-xs font-mono text-gray-400 ml-3 flex-shrink-0">
                            {s.reference}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {carregandoProduto && (
            <p className="text-sm text-gray-400 animate-pulse">Carregando produto...</p>
          )}

          {/* Produto selecionado */}
          {produto && (
            <div className="flex flex-col gap-4 pt-2 border-t border-gray-100">

              <div className="flex items-center justify-between gap-3 bg-gray-50
                border border-gray-100 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{produto.name}</p>
                  <p className="text-xs font-mono text-gray-400">{produto.reference}</p>
                </div>
                <button type="button" onClick={limparBusca}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400
                    hover:text-red-500 hover:bg-red-50 transition-colors">
                  <CloseIcon />
                </button>
              </div>

              {/* Variante */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500">Variante</label>
                <select value={varianteUuid} onChange={(e) => setVarianteUuid(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900
                    outline-none focus:border-blue-400 transition-colors bg-white">
                  <option value="">Selecione</option>
                  {produto.variations?.map((v) => (
                    <option key={v.uuid} value={v.uuid}>
                      {v.color_name}{v.size_name ? ` · ${v.size_name}` : ""} — {fmt(v.price || 0)}
                    </option>
                  ))}
                </select>

                {varianteSelecionada && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-block w-3 h-3 rounded-full border border-gray-300 flex-shrink-0"
                      style={{ background: varianteSelecionada.color_hex }} />
                    <span className="text-xs text-gray-500">
                      {varianteSelecionada.color_name}
                      {varianteSelecionada.size_name && ` · ${varianteSelecionada.size_name}`}
                    </span>
                    <span className="text-xs font-medium text-gray-900 ml-auto">
                      {fmt(varianteSelecionada.price || 0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Quantidade */}
              <div className="flex items-end gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs text-gray-500">Quantidade</label>
                  <input type="number" min="1" value={quantidade}
                    onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900
                      outline-none focus:border-blue-400 transition-colors" />
                </div>
                <button type="button" onClick={adicionarAoCarrinho} disabled={!varianteUuid}
                  className="px-5 py-2.5 text-sm bg-gray-900 text-white rounded-lg
                    hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  + Adicionar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Carrinho */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Carrinho</p>
            <span className="text-xs text-gray-400">{carrinho.length} item(s)</span>
          </div>

          {carrinho.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-gray-400">
              Nenhum item adicionado.
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {carrinho.map((item) => (
                <div key={item.chave} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.nome}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="inline-block w-2.5 h-2.5 rounded-full border border-gray-300"
                        style={{ background: item.cor_hex }} />
                      <span className="text-xs text-gray-400">
                        {item.cor}{item.tamanho ? ` · ${item.tamanho}` : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => alterarQtd(item.chave, item.quantidade - 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200
                        text-gray-500 hover:bg-gray-50 transition-colors">−</button>
                    <span className="w-8 text-center text-sm font-medium text-gray-900">
                      {item.quantidade}
                    </span>
                    <button onClick={() => alterarQtd(item.chave, item.quantidade + 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200
                        text-gray-500 hover:bg-gray-50 transition-colors">+</button>
                  </div>

                  <span className="text-sm font-medium text-gray-900 w-20 text-right flex-shrink-0">
                    {fmt(item.preco * item.quantidade)}
                  </span>

                  <button onClick={() => removerItem(item.chave)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400
                      hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0">
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Coluna direita: pagamento + resumo ────────────────────────────── */}
      <div className="flex flex-col gap-4 w-full lg:w-80">

        {/* Pagamento */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-4">
          <p className="text-sm font-medium text-gray-700">Pagamento</p>

          <div className="grid grid-cols-2 gap-2">
            {PAGAMENTOS.map((p) => (
              <button key={p.id} type="button" onClick={() => setPagamento(p.id)}
                className={`py-2.5 rounded-xl border text-sm font-medium transition-all duration-150
                  ${pagamento === p.id
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500">
              Desconto <span className="text-gray-300">(opcional)</span>
            </label>
            <input type="number" min="0" step="0.01" value={desconto}
              onChange={(e) => setDesconto(e.target.value)} placeholder="R$ 0,00"
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900
                outline-none focus:border-blue-400 transition-colors" />
          </div>
        </div>

        {/* Resumo */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-3">
          <p className="text-sm font-medium text-gray-700">Resumo</p>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span>{fmt(subtotal)}</span>
          </div>
          {descontoVal > 0 && (
            <div className="flex items-center justify-between text-sm text-red-500">
              <span>Desconto</span>
              <span>− {fmt(descontoVal)}</span>
            </div>
          )}
          <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Total</span>
            <span className="text-lg font-medium text-gray-900">{fmt(total)}</span>
          </div>
        </div>

        {erro && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
            {erro}
          </p>
        )}
        {sucesso && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
            Venda finalizada com sucesso!
          </p>
        )}

        <button type="button" onClick={finalizarVenda}
          disabled={!carrinho.length || finalizando || sucesso}
          className="w-full py-3.5 rounded-xl bg-gray-900 text-white text-sm font-medium
            hover:bg-gray-700 active:scale-95 transition-all duration-150
            disabled:opacity-40 disabled:cursor-not-allowed">
          {finalizando ? "Finalizando..." : "Finalizar venda"}
        </button>

        {carrinho.length > 0 && (
          <button type="button" onClick={() => setCarrinho([])}
            className="w-full py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500
              hover:bg-gray-50 transition-colors">
            Limpar carrinho
          </button>
        )}
      </div>
    </div>
  );
};

export default Caixa;