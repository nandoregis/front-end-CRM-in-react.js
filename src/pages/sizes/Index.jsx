import { useNavigate } from "react-router-dom";
import PlusIcon from "../../components/svg/PlusIcon";


const SizePage = ({children}) =>  {
    const navigate = useNavigate();

    return(<>
        <div className="min-h-screen w-full bg-gray-50 font-sans">
         
            <div className="flex justify-between items-center w-full bg-white border-b border-gray-100 px-6 py-4">
                <div>
                    <h1 className="text-base font-medium text-gray-900">Tamanhos - unidades de medidas</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Gerencie seus tamanhos</p>
                </div>
                <div>
                    <button 
                        onClick={() => {
                            navigate("/cores/new");
                        }}
                        type="button" 
                        className="
                        cursor-pointer
                        flex items-center gap-2 
                        px-3 py-2 
                        bg-gray-800 text-white 
                        shadow-md 
                        rounded-md
                        hover:bg-gray-700 
                        active:scale-95 
                        transition-all duration-200 
                        font-medium
                    ">
                        <PlusIcon/>
                        <span>Criar Tamanho</span>
                    </button>
                </div>

            </div>

            

             <div className="p-6">
               {children}
            </div>
        </div>
    </>);

}

export default SizePage;