import { useState, useEffect } from "react";
import Api from "../../../../services/Api";
import ProdutoCard from "./ProductCard";
import SearchIcon from "../../../../components/svg/SearchIcon";
import { useNavigate } from "react-router-dom";

const Skeleton = () => (
  <div className="animate-pulse flex flex-col gap-2">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-3.5 bg-gray-100 rounded w-2/5" />
          <div className="h-3 bg-gray-100 rounded w-1/4" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-gray-100 rounded-lg" />
          <div className="h-8 w-8 bg-gray-100 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);


const ProductsList = ({ onEditar, onDeletar }) => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [saindo, setSaindo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const carregar = async () => {
        try {
          const res = await Api.get("/v1/produtos");
          setProdutos(res.data.data);
        } catch {
          setProdutos([]);
        } finally {
          setLoading(false);
        }
    };

    carregar();
        
  }, []);
  
  /** inativo temporiamente.*/
  const handleDeletar = async (uuid) => {
    if (!confirm("Deseja remover este produto ?")) return;
    setSaindo(uuid);
    setTimeout(async () => {
      try {
        await Api.delete(`/v1/produtos/${uuid}`);
        onDeletar?.(uuid);
      } catch {}
      setProdutos((p) => p.filter((x) => x.uuid !== uuid));
      setSaindo(null);
    }, 300);
  };

  const filtrados = produtos.filter(
    (p) =>
      p.name.toLowerCase().includes(busca.toLowerCase()) ||
      p.reference.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <SearchIcon/>
        </span>
        <input
          type="text"
          placeholder="Buscar por nome ou referência..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg
            outline-none focus:border-blue-400 transition-colors"
        />
      </div>

      {!loading && (
        <p className="text-xs text-gray-400">{filtrados.length} produto(s) encontrado(s)</p>
      )}

      {loading ? (
        <Skeleton />
      ) : filtrados.length === 0 ? (
        <div className="text-center py-16 text-sm text-gray-400">
          Nenhum produto encontrado.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtrados.map((p) => (
            <ProdutoCard
              key={p.uuid}
              produto={p}
              onEditar={onEditar ?? (() => {
                navigate(`/produtos/edit/${p.uuid}`);
              })}
              onDeletar={ () => {
                alert('Em desenvolvimento...')
              }}
              saindo={saindo === p.uuid}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsList;