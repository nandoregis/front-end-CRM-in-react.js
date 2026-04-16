import { useEffect, useRef, useState } from "react";
import SearchIcon from "../../../components/svg/SearchIcon";
import CloseIcon from "../../../components/svg/CloseIcon";
import Api from "../../../services/Api";
import ProdutoSelecionado from "./ProdutoSelecionado";

const Busca = ({produtoSelecionado, produtoDoCarrinho}) => {

    const [termo, setTermo] = useState("");
    const [buscando, setBuscando] = useState(false);
    const [carregandoProduto, setCarregandoProduto] = useState(false);
    const [sugestoes, setSugestoes] = useState([]);
    const [quantidade, setQuantidade] = useState(1);
    const [produto, setProduto] = useState(null);
    const [dropdownAberto, setDropdownAberto] = useState(false);

    const debounceRef = useRef(null);
    const wrapperRef = useRef(null);


      useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setDropdownAberto(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);


    // buscando produto

    useEffect( () => {
        if(!termo.trim()) {
            setSugestoes([]);
            setDropdownAberto(false);
            return;
        }
        
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            
            setBuscando(true);
            
            try {
                const res = await Api.get(`/v1/produtos/reference/search/${termo.trim()}`);
                const lista = Array.isArray(res.data.data) ? res.data.data : res.data;
                setSugestoes(lista);
                setDropdownAberto(true);
            } catch {
                setSugestoes([]);
                setDropdownAberto(false);
            } finally {
                setBuscando(false);
            }

        }, 350);

        return () => clearTimeout(debounceRef.current);

    }, [termo]);

    const limparBusca = () => {
        setTermo("");
        setBuscando(false);
        setCarregandoProduto(false);
        setSugestoes(null);
        setQuantidade(1);
        setProduto(null);
        setDropdownAberto(false);
    }

    const selecionarSugestao = async (item) => {
        setDropdownAberto(false);
        setTermo(item.name ?? item.reference ?? "");
        setQuantidade(1);
        setCarregandoProduto(true);

        try {
            const res = await Api.get(`/v1/product-variations/${item.uuid}`);
            item.variations = res.data?.data;
            setProduto(item);
            produtoSelecionado(item);
        } catch {
            setProduto(null);
        } finally {
            setCarregandoProduto(false);
        }
    };

    const adicionarAoCarrinho = (item) => {
        produtoDoCarrinho(item);
    }


    return (
        <>
            <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-4">
                <p className="text-sm font-medium text-gray-700">Buscar produto</p>

                <div className="relative" ref={wrapperRef}>
                    <div className="relative">
                        {/* Ícone */}
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <SearchIcon/>
                        </span>

                        {/* Input */}
                        <input
                        type="text"
                        placeholder="Digite o nome ou referência..."
                        value={termo}
                        onChange={ (e) => setTermo(e.target.value)}
                        className="
                            w-full
                            pl-10 pr-10 py-2.5
                            text-sm text-gray-900
                            bg-gray-50
                            border border-gray-200
                            rounded-lg
                            outline-none
                            transition-all duration-200
                            focus:bg-white
                            focus:border-gray-400
                            placeholder:text-gray-400
                        "
                        />

                        {/* Botão limpar */}
                        <button
                        type="button"
                        onClick={limparBusca}
                        className="cursor-pointer
                            absolute right-3 top-1/2 -translate-y-1/2
                            text-gray-400 hover:text-gray-600
                            transition-colors
                        "
                        >
                        <CloseIcon/>
                        </button>
                    </div>


                    {dropdownAberto && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200
                            rounded-xl shadow-lg z-50 overflow-hidden">
                            {buscando ? (
                            <div className="px-4 py-3 text-sm text-gray-400">Buscando...</div>
                            ) : sugestoes.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-gray-400">Nenhum resultado.</div>
                            ) : (
                            <ul className="divide-y divide-gray-50 max-h-56 overflow-y-auto">
                                {sugestoes.map((s) => (
                                <li key={s.uuid}>
                                    <button type="button" onMouseDown={() => selecionarSugestao(s)}
                                    className="w-full flex items-center justify-between px-4 py-3
                                        hover:bg-gray-50 transition-colors text-left">
                                    <span className="text-sm text-gray-900">{s.name}</span>
                                    <span className="text-xs font-mono text-gray-400 ml-3 flex-shrink-0">
                                        {s.reference}
                                    </span>
                                    </button>
                                </li>
                                ))}
                            </ul>
                            )}
                        </div>
                    )}

                    {carregandoProduto && (
                        <p className="text-sm text-gray-400 animate-pulse">Carregando produto...</p>
                    )}

                   { produto && (
                     <ProdutoSelecionado 
                        produto={produto} 
                        limparBusca={limparBusca} 
                        adicionarAoCarrinho={adicionarAoCarrinho}
                    />
                   )}

                </div>


            </div>
        </>
    );
}

export default Busca;