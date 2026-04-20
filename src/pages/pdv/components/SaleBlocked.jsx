import CheckIcon from "../../../components/svg/CheckIcon";
import fmt from "./fmt";

export default function SaleBlocked({ sale, visible, onNovaVenda}) {
    if (!visible) return null;
    const subtotal = parseFloat(sale.discount) ? parseFloat(sale.total) + parseFloat(sale.discount) : null;

    const LABEL_PAGAMENTO = {
        dinheiro: "Dinheiro",
        credito:  "Cartão de crédito",
        debito:   "Cartão de débito",
        pix:      "PIX",
        pendente: "Pendente",
    };

    return (
        <div className="w-full bg-gray-50 font-sans flex items-center justify-center p-5">
        <div className="w-full max-w-sm flex flex-col gap-5">
    
            {/* Ícone de sucesso */}
            <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
                <CheckIcon/>
            </div>
            <div>
                <h1 className="text-base font-medium text-gray-900">Venda finalizada</h1>
                <p className="text-sm text-gray-500 mt-0.5">Esta venda já foi encerrada</p>
            </div>
            </div>
    
            {/* Detalhes da venda */}
            {sale && (
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
    
                <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-xs text-gray-400 font-mono"># {sale.uuid}</p>
                </div>
    
                <div className="px-5 py-4 flex flex-col gap-3">
    
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full font-medium">
                    Fechada
                    </span>
                </div>
    
                {sale.payment && (
                    <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Pagamento</span>
                    <span className="text-gray-900 font-medium">
                        {LABEL_PAGAMENTO[sale.payment] ?? sale.payment}
                    </span>
                    </div>
                )}

                {sale.discount && (
                    <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Desconto</span>
                    <span className="text-gray-900 font-medium">
                        {fmt(sale.discount)}
                    </span>
                    </div>
                )}

                {subtotal && (
                    <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900 font-medium">
                        {fmt( subtotal )}
                    </span>
                    </div>
                )}
    
                {sale.total !== undefined && (
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-sm font-medium text-gray-900">Total</span>
                    <span className="text-lg font-medium text-gray-900">
                        {fmt(sale.total)}
                    </span>
                    </div>
                )}
                </div>
            </div>
            )}
    
            {/* Ação */}
            {onNovaVenda && (
            <button
                type="button"
                onClick={onNovaVenda}
                className="cursor-pointer w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-medium
                hover:bg-gray-700 active:scale-95 transition-all duration-150"
            >
                Iniciar nova venda
            </button>
            )}
    
        </div>
        </div>
    );
}