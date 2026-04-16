const PAGAMENTOS = [
  { id: "dinheiro", label: "Dinheiro" },
  { id: "credito",  label: "Crédito"  },
  { id: "debito",   label: "Débito"   },
  { id: "pix",      label: "PIX"      },
];

const Payment = ({ pagamento, setPagamento, desconto, setDesconto }) => (
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
      <input
        type="number" min="0" step="0.01"
        value={desconto}
        onChange={(e) => setDesconto(e.target.value)}
        placeholder="R$ 0,00"
        className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900
          outline-none focus:border-blue-400 transition-colors"
      />
    </div>
  </div>
);

export default Payment;