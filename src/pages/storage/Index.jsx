import { useState } from "react";
import Api from "../../services/Api";
import BackIcon from "../../components/svg/BackIcon";
import SearchIcon from "../../components/svg/SearchIcon";
import { useToast } from '../../context/ToastContext';
import { FormatErrorMessage } from "../../components/FormatErrorMessage";

const ROTAS = {
  entrada: "/v1/stock/in",
  saida:   "/v1/stock/out",
};

const CloseIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const StockMovement = ({ onVoltar }) => {
  const [tipo, setTipo] = useState("entrada");
  const [referencia, setReferencia] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [produto, setProduto] = useState(null);
  const [erroBusca, setErroBusca] = useState(null);
  const [variante_uuid, setVariante_uuid] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [observacao, setObservacao] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);

  const {addToast} = useToast();

  const buscarProduto = async () => {
    if (!referencia.trim()) return;
    setErroBusca(null);
    setProduto(null);
    setVariante_uuid("");
    setBuscando(true);

    try {
      const res = await Api.get(`/v1/produtos/reference/${referencia.trim()}`);
      const encontrado = Array.isArray(res.data.data)
        ? res.data.data.find((p) => p.reference === referencia.trim())
        : res.data.data;

      if (!encontrado) {
        throw {
          response: {
            status: 404,
            data: { message: "Produto não encontrado" }
          }
        };
      }

      setProduto(encontrado);
    } catch (err) {
      const errorMessage = err.response?.data?.message || '';
      addToast('error', FormatErrorMessage(errorMessage));
    } finally {
      setBuscando(false);
    }
  };

  const limparProduto = () => {
    setProduto(null);
    setReferencia("");
    setVariante_uuid("");
    setQuantidade("");
    setObservacao("");
    setErroBusca(null);
    setErro(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setSucesso(false);
    setSalvando(true);

    const payload = {
      product_uuid: produto.uuid,
      variations: [
        {
          uuid: variante_uuid,
          quantity: parseInt(quantidade),
        },
      ],
    };

    try {
      await Api.post(ROTAS[tipo], payload);
      setSucesso(true);
      setTimeout(() => {
        limparProduto();
        setSucesso(false);
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || '';
      addToast('error', FormatErrorMessage(errorMessage));
    } finally {
      setSalvando(false);
    }
  };

  const varianteSelecionada = produto ? produto?.variations.find((v) => v.uuid === variante_uuid) : null;

  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans p-5">

      {/* Header */}
      <div className="flex items-center pb-5">
        {onVoltar && (
          <button
            type="button"
            onClick={onVoltar}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400
              hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <BackIcon />
          </button>
        )}
        <div>
          <h1 className="text-base font-medium text-gray-900">Movimentação de estoque</h1>
          <p className="text-sm text-gray-500 mt-0.5">Registre entrada ou saída de produtos</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Tipo */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-4">
          <p className="text-sm font-medium text-gray-700">Tipo de movimentação</p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTipo("entrada")}
              className={`py-3 rounded-xl border text-sm font-medium transition-all duration-150
                ${tipo === "entrada"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
            >
              Entrada
            </button>
            <button
              type="button"
              onClick={() => setTipo("saida")}
              className={`py-3 rounded-xl border text-sm font-medium transition-all duration-150
                ${tipo === "saida"
                  ? "bg-red-50 border-red-200 text-red-600"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
            >
              Saída
            </button>
          </div>
        </div>

        {/* Busca por referência */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-4">
          <p className="text-sm font-medium text-gray-700">Produto</p>

          {!produto ? (
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <SearchIcon />
                  </span>
                  <input
                    type="text"
                    value={referencia}
                    onChange={(e) => { setReferencia(e.target.value); setErroBusca(null); }}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), buscarProduto())}
                    placeholder="Digite a referência do produto..."
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg
                      outline-none focus:border-blue-400 transition-colors font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={buscarProduto}
                  disabled={buscando || !referencia.trim()}
                  className="px-4 py-2.5 text-sm bg-blue-600 text-white rounded-lg
                    hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {buscando ? "Buscando..." : "Buscar"}
                </button>
              </div>

              {erroBusca && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                  {erroBusca}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">

              {/* Card do produto encontrado */}
              <div className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-gray-900">{produto.name}</span>
                  <span className="text-xs font-mono text-gray-400">{produto.reference}</span>
                </div>
                <button
                  type="button"
                  onClick={limparProduto}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400
                    hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Variante */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500">Variante (cor + tamanho)</label>
                <select
                  value={variante_uuid}
                  onChange={(e) => setVariante_uuid(e.target.value)}
                  required
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900
                    outline-none focus:border-blue-400 transition-colors bg-white"
                >
                  <option value="">Selecione a variante</option>
                  {produto.variations.map((v) => (
                    <option key={v.uuid} value={v.uuid}>
                      {v.color_name}{v.size_name ? ` · ${v.size_name}` : ""}
                    </option>
                  ))}
                </select>

                {varianteSelecionada && (
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="inline-block w-3 h-3 rounded-full border border-gray-300 flex-shrink-0"
                      style={{ background: varianteSelecionada.color_hex }}
                    />
                    <span className="text-xs text-gray-500">
                      {varianteSelecionada.color_name}
                      {varianteSelecionada.size_name && ` · ${varianteSelecionada.size_name}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quantidade + Observação */}
        {produto && (
          <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-4">
            <p className="text-sm font-medium text-gray-700">Detalhes</p>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500">Quantidade</label>
              <input
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                placeholder="Ex: 10"
                required
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900
                  outline-none focus:border-blue-400 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500">
                Observação <span className="text-gray-300">(opcional)</span>
              </label>
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Ex: Recebimento NF 1234..."
                rows={3}
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900
                  outline-none focus:border-blue-400 transition-colors resize-none"
              />
            </div>
          </div>
        )}

        {/* Ações */}
        {produto && (
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={limparProduto}
              className="text-sm px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600
                hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando || sucesso}
              className={`text-sm px-5 py-2.5 rounded-lg text-white
                active:scale-95 transition-all duration-150
                disabled:opacity-60 disabled:cursor-not-allowed
                ${tipo === "entrada"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-500 hover:bg-red-600"}`}
            >
              {salvando
                ? "Registrando..."
                : tipo === "entrada"
                  ? "Registrar entrada"
                  : "Registrar saída"}
            </button>
          </div>
        )}

      </form>
    </div>
  );
};

export default StockMovement;