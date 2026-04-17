const fmt = (val) =>
  Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Summary = ({ subtotal, descontoVal, total, onFinalizar, finalizando, sucesso, onLimpar, temItens }) => (
  <div className="flex flex-col gap-3">

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

    <button type="button" onClick={onFinalizar}
      disabled={!temItens || finalizando || sucesso}
      className="cursor-pointer w-full py-3.5 rounded-xl bg-gray-900 text-white text-sm font-medium
        hover:bg-gray-700 active:scale-95 transition-all duration-150
        disabled:opacity-40 disabled:cursor-not-allowed">
      {finalizando ? "Finalizando..." : "Finalizar venda"}
    </button>

    {temItens && (
      <button type="button" onClick={onLimpar}
        className="cursor-pointer w-full py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500
          hover:bg-gray-50 transition-colors">
        Limpar carrinho
      </button>
    )}
  </div>
);

export default Summary;