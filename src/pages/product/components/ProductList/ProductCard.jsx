import DollarIcon from "../../../../components/svg/DollarIcon";
import EditIcon from "../../../../components/svg/EditIcon";

const precoDisplay = (variations) => {
  const precos = variations.map((v) => parseFloat(v.price)).filter((p) => p > 0);
  if (!precos.length) return null;
  return `R$ ${Math.max(...precos).toFixed(2).replace(".", ",")}`;
};

const getTamanhos = (variations) =>
  [...new Set(variations.map((v) => v.size_name).filter(Boolean))];

const getCores = (variations) =>
  [...new Map(variations.map((v) => [v.color_name, v.color_hex])).entries()];

const ProdutoCard = ({ produto, onEditar, onDeletar, saindo }) => {
  const preco = precoDisplay(produto.variations);
  const tamanhos = getTamanhos(produto.variations);
  const cores = getCores(produto.variations);

  return (
    <div className={`
      bg-white border border-gray-100 rounded-xl p-4
      flex items-center justify-between gap-4
      transition-all duration-300 ease-in-out
      hover:border-gray-200 hover:shadow-sm
      ${saindo ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}
    `}>
      <div className="flex flex-col gap-1.5 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-gray-900 text-sm">{produto.name}</span>
          <span className="text-xs font-mono text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
            {produto.reference}
          </span>
          {preco && (
            <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-md">
              {preco}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {cores.map(([nome, hex]) => (
            <span key={nome} className="flex items-center gap-1 text-xs text-gray-500">
              <span className="inline-block w-3 h-3 rounded-full border border-gray-300 flex-shrink-0"
                style={{ background: hex }} />
              {nome}
            </span>
          ))}

          {tamanhos.length > 0 && (
            <div className="flex items-center gap-1">
              {tamanhos.map((s) => (
                <span key={s} className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded">
                  {s}
                </span>
              ))}
            </div>
          )}

          <span className="text-xs text-gray-400">
            {produto.variations.length} variante(s)
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={() => onEditar(produto)}
          title="Editar"
          className="cursor-pointer  w-8 h-8 flex items-center justify-center rounded-lg text-gray-400
            hover:text-blue-600 hover:bg-blue-50 transition-colors duration-150"
        >
          <EditIcon/>
        </button>
        <button
          onClick={() => onDeletar(produto.uuid)}
          title="Deletar"
          className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg text-gray-400
            hover:text-green-500 hover:bg-green-50 transition-colors duration-150"
        >
          <DollarIcon/>
        </button>
      </div>
    </div>
  );
};

export default ProdutoCard;