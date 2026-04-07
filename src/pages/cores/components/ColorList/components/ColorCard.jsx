import EditIcon from "../../../../../components/svg/EditIcon";
import TrashIcon from "../../../../../components/svg/TrashIcon";

const ColorCard = ({ cor, onEditar, onDeletar, saindo }) => (
  <div className={`
    bg-white border border-gray-100 rounded-xl p-4
    flex items-center gap-4
    transition-all duration-300 ease-in-out
    hover:border-gray-200 hover:shadow-sm
    ${saindo ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}
  `}>

    {/* Amostra */}
    <div
      className="w-8 h-8 rounded-lg border border-gray-200 flex-shrink-0"
      style={{ background: cor.color_hex }}
    />

    {/* Info */}
    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
      <span className="text-sm font-medium text-gray-900">{cor.name}</span>
      <span className="text-xs font-mono text-gray-400">{cor.color_hex}</span>
    </div>

    {/* Ações */}
    <div className="flex items-center gap-1.5 flex-shrink-0">
      <button
        onClick={() => onEditar(cor)}
        title="Editar"
        className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg text-gray-400
          hover:text-blue-600 hover:bg-blue-50 transition-colors duration-150"
      >
        <EditIcon />
      </button>
      <button
        onClick={() => onDeletar(cor.uuid)}
        title="Deletar"
        className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg text-gray-400
          hover:text-red-500 hover:bg-red-50 transition-colors duration-150"
      >
        <TrashIcon />
      </button>
    </div>
  </div>
);

export default ColorCard;