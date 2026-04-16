const Carrinho  = () => {
    return (
        <>
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
        </>
    );
}

export default Carrinho;