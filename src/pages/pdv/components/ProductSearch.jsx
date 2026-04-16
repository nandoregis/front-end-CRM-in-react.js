import { useEffect, useRef } from "react";
import Api from "../../../services/Api";
import SearchIcon from "../../../components/svg/SearchIcon";

const CloseIcon = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const fmt = (val) =>
  Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const ProductSearch = ({
  termo, setTermo,
  sugestoes, setSugestoes,
  buscando, setBuscando,
  dropdownAberto, setDropdownAberto,
  produto, setProduto,
  carregandoProduto, setCarregandoProduto,
  varianteUuid, setVarianteUuid,
  quantidade, setQuantidade,
  onAdicionarAoCarrinho,
}) => {
  const debounceRef = useRef(null);
  const wrapperRef  = useRef(null);

  // fecha dropdown ao clicar fora
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setDropdownAberto(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // busca com debounce
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

  const selecionarSugestao = async (item) => {
    setDropdownAberto(false);
    setTermo(item.name ?? item.reference ?? "");
    setSugestoes([]);
    setVarianteUuid("");
    setQuantidade(1);
    setProduto(null);
    setCarregandoProduto(true);

    try {
      const res = await Api.get(`/v1/product-variations/${item.uuid}`);
      item.variations = res.data.data;
      setProduto(item);
    } catch {
      setProduto(null);
    } finally {
      setCarregandoProduto(false);
    }
  };

  const limpar = () => {
    setTermo("");
    setSugestoes([]);
    setProduto(null);
    setVarianteUuid("");
    setQuantidade(1);
    setDropdownAberto(false);
  };

  const varianteSelecionada = produto?.variations?.find((v) => v.uuid === varianteUuid);

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-4">
      <p className="text-sm font-medium text-gray-700">Buscar produto</p>

      {/* Input + dropdown */}
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
            <button type="button" onClick={limpar}
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

          {/* Card produto */}
          <div className="flex items-center justify-between gap-3 bg-gray-50
            border border-gray-100 rounded-xl px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">{produto.name}</p>
              <p className="text-xs font-mono text-gray-400">{produto.reference}</p>
            </div>
            <button type="button" onClick={limpar}
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

          {/* Quantidade + adicionar */}
          <div className="flex items-end gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs text-gray-500">Quantidade</label>
              <input type="number" min="1" value={quantidade}
                onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900
                  outline-none focus:border-blue-400 transition-colors" />
            </div>
            <button type="button" onClick={onAdicionarAoCarrinho} disabled={!varianteUuid}
              className="px-5 py-2.5 text-sm bg-gray-900 text-white rounded-lg
                hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              + Adicionar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;