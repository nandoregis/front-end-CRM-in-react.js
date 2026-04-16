import { useState } from "react";
import CloseIcon from "../../../components/svg/CloseIcon";

const ProdutoSelecionado = ({produto, adicionarAoCarrinho ,limparBusca}) => {
    
    const [varianteUuid, setVarianteUuid] = useState("");
    const [quantidade, setQuantidade] = useState(1);

    const fmt = (val) =>
      Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    ;


    const varianteSelecionada = produto?.variations?.find((v) => v.uuid === varianteUuid);


    console.log(varianteSelecionada)

    return (
        <>
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
                      {v.color_name} {v.size_name ? ` · ${v.size_name}` : ""} : {fmt(v.price || 0)}
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
        </>
    );
}

export default ProdutoSelecionado;