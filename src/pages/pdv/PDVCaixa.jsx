import { Navigate, useNavigate, useParams } from "react-router-dom";
import Api from "../../services/Api";
import { use, useEffect, useState } from "react";
import Caixa from "./components/Caixa";

const PDVCaixa = () => {

  const {uuid} = useParams();

  //------------- states ------------------
  const [sale, setSale] = useState([]);
  const [openSale, setOpenSale] = useState(false);

  //------------- metodos ----------------
  const navigate = useNavigate();

  useEffect( () => {

    const SaleStatus = async () => {

      try {
        const data = await Api.get(`/v1/sales/${uuid}`);
        const mySale = data?.data?.data;
        
        if(mySale.status == 0) {
          setOpenSale(true);
        } else {
          setOpenSale(false);
        }
        setSale(data?.data?.data);
      } catch (err) {
        setOpenSale(false);
        // navigate("/pdv");
      } 
    }
    
    SaleStatus(); 
  }, []);


  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans">

      <div className="w-full bg-white border-b border-gray-100 px-6 py-4">
        <h1 className="text-base font-medium text-gray-900">PDV — Ponto de venda</h1>
        <p className="text-sm text-gray-500 mt-0.5">Adicione produtos e finalize a venda</p>
      </div>

      { openSale && <Caixa sale={sale} /> }
      
    </div>
  );
}

export default PDVCaixa;
