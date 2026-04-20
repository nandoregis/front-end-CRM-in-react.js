import { useEffect, useState } from "react";
import Api from "../../services/Api";
import { useNavigate } from "react-router-dom";
import { useToast } from '../../context/ToastContext';
import { FormatErrorMessage } from "../../components/FormatErrorMessage";

const PDV = ({ onCriada }) => {
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);
  const [saleOpen, setSaleOpen] = useState(false);
  const [sales, setSales] = useState([]);
  const {addToast} = useToast();
 
  const navigate = useNavigate();

  useEffect( () => {
    const saleStatus = async () => {
      try {
        const res = await Api.get('/v1/sales/status/open');
        const mySale = res?.data?.data;

        if(mySale.length > 0) {
          setSaleOpen(true);
          addToast('warning', 'Existe uma ou mais vendas em aberto')
        }

        setSales(mySale);

      } catch (err) {
        
      }
        
    }

    saleStatus();
  }, []);

  console.log(sales);

  const criarVenda = async () => {
    setErro(null);
    setSalvando(true);

    try {
      const res = await Api.post("/v1/sales/c/create");
      const sale = res.data.data;
      onCriada?.(res.data.data ?? res.data);
      navigate(`/pdv/${sale.uuid}`);
    } catch {
       const errorMessage = err.response?.data?.message;
      var message = FormatErrorMessage(errorMessage);
      
      addToast('error', message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <>
      {saleOpen && (
        <>

          <div className="min-h-screen w-full bg-gray-50 font-sans flex flex-col p-5">
            {sales.map((venda) => (
              <div
                key={venda.uuid}
                className="bg-white rounded-xl p-4 shadow border border-gray-100 cursor-pointer hover:shadow-md transition"
                onClick={() => {
                  navigate(`/pdv/${venda.uuid}`);
                }}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-800">
                    #{venda.uuid.slice(0, 8)}
                  </span>

                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                    Em aberto
                  </span>
                </div>

                {/* Pagamento */}
                <p className="text-xs text-gray-500 mb-2">
                  Pagamento: {venda.payment}
                </p>

            
              </div>
            ))}
          </div>


        </>
      )}
      {!saleOpen && (
        <div className="min-h-screen w-full bg-gray-50 font-sans flex items-center justify-center p-5">
          <div className="w-full max-w-sm flex flex-col gap-5 items-center text-center">

            {/* Ícone */}
            <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center">
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white"
                strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <path d="M3 6h18 M16 10a4 4 0 01-8 0" />
              </svg>
            </div>

            {/* Texto */}
            <div>
              <h1 className="text-base font-medium text-gray-900">Nova venda</h1>
              <p className="text-sm text-gray-500 mt-1">
                Clique no botão abaixo para iniciar uma nova venda no PDV.
              </p>
            </div>

            {/* Botão */}
            <button
              type="button"
              onClick={criarVenda}
              disabled={salvando}
              className="cursor-pointer w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-medium
                hover:bg-gray-700 active:scale-95 transition-all duration-150
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {salvando ? "Criando venda..." : "Iniciar nova venda"}
            </button>

          </div>
        </div>
      )}
    </>
  );
};

export default PDV;