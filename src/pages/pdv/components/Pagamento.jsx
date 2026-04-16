const Pagamento = () => {
    return (
    <>
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
    </>
);
}