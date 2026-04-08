import { useState, useEffect } from "react";
import Api from "../../../../services/Api";
import SearchIcon from "../../../../components/svg/SearchIcon";
import SizeCard from "./components/SizeCard";


const MOCK = [
  { uuid: "1", name: "PP" },
  { uuid: "2", name: "P"  },
  { uuid: "3", name: "M"  },
  { uuid: "4", name: "G"  },
  { uuid: "5", name: "GG" },
];


const Skeleton = () => (
  <div className="animate-pulse flex flex-col gap-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between gap-4">
        <div className="h-3.5 bg-gray-100 rounded w-1/6" />
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-gray-100 rounded-lg" />
          <div className="h-8 w-8 bg-gray-100 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);


const SizeList = () => {
  const [tamanhos, setTamanhos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [saindo, setSaindo] = useState(null);

  useEffect(() => {
    const carregar = async () => {
      try {
        const res = await Api.get("/v1/sizes");
        setTamanhos(res.data.data);
      } catch {
        setTamanhos(MOCK);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  const handleDeletar = async (uuid) => {
    alert('em desenvolvimento...');
    return;
    if (!confirm("Deseja remover este tamanho?")) return;
    setSaindo(uuid);
    setTimeout(async () => {
      try {
        await Api.delete(`/v1/sizes/${uuid}`);
        onDeletar?.(uuid);
      } catch {}
      setTamanhos((p) => p.filter((t) => t.uuid !== uuid));
      setSaindo(null);
    }, 300);
  };

  const filtrados = tamanhos.filter((t) =>
    t.name.toLowerCase().includes(busca.toLowerCase())
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
          placeholder="Buscar tamanho..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg
            outline-none focus:border-blue-400 transition-colors"
        />
      </div>

      {/* Contagem */}
      {!loading && (
        <p className="text-xs text-gray-400">{filtrados.length} tamanho(s) encontrado(s)</p>
      )}

      {/* Lista */}
      {loading ? (
        <Skeleton />
      ) : filtrados.length === 0 ? (
        <div className="text-center py-16 text-sm text-gray-400">
          Nenhum tamanho encontrado.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtrados.map((t) => (
            <SizeCard
              key={t.uuid}
              tamanho={t}
              onEditar={(() => {
                alert('em desenvolvimento...');
              })}
              onDeletar={handleDeletar}
              saindo={saindo === t.uuid}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SizeList;