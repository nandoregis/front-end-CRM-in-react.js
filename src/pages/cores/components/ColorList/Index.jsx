import { useState, useEffect } from "react";
import Api from "../../../../services/Api";
import SearchIcon from "../../../../components/svg/SearchIcon";
import ColorCard from "./components/ColorCard";

const Skeleton = () => (
  <div className="animate-pulse flex flex-col gap-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex-shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-3.5 bg-gray-100 rounded w-1/4" />
          <div className="h-3 bg-gray-100 rounded w-1/6" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-gray-100 rounded-lg" />
          <div className="h-8 w-8 bg-gray-100 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

const ColorList = ({ onEditar, onDeletar }) => {
  const [cores, setCores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [saindo, setSaindo] = useState(null);

  useEffect(() => {
    const carregar = async () => {
      try {
        const res = await Api.get("/v1/colors");
        setCores(res.data.data);
      } catch {
        setCores([]);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  const handleDeletar = async (uuid) => {
    alert('Não está permitido no momento.');
  };

  const filtradas = cores.filter((c) =>
    c.name.toLowerCase().includes(busca.toLowerCase()) ||
    c.color_hex.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-4">

      {/* Busca */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <SearchIcon />
        </span>
        <input
          type="text"
          placeholder="Buscar por nome ou hex..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg
            outline-none focus:border-blue-400 transition-colors"
        />
      </div>

      {/* Contagem */}
      {!loading && (
        <p className="text-xs text-gray-400">{filtradas.length} cor(es) encontrada(s)</p>
      )}

      {/* Lista */}
      {loading ? (
        <Skeleton />
      ) : filtradas.length === 0 ? (
        <div className="text-center py-16 text-sm text-gray-400">
          Nenhuma cor encontrada.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtradas.map((c) => (
            <ColorCard
              key={c.uuid}
              cor={c}
              onEditar={onEditar ?? (() => {})}
              onDeletar={handleDeletar}
              saindo={saindo === c.uuid}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorList;