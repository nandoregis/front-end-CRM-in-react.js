import ButtonEditList from "../../../../../components/buttons/ButtonEditList";
import EditIcon from "../../../../../components/svg/EditIcon";
import TrashIcon from "../../../../../components/svg/TrashIcon";

const SizeCard = ({ tamanho, onEditar, onDeletar, saindo }) => (
  <div className={`
    bg-white border border-gray-100 rounded-xl p-4
    flex items-center justify-between gap-4
    transition-all duration-300 ease-in-out
    hover:border-gray-200 hover:shadow-sm
    ${saindo ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}
  `}>
    <div className="flex items-center gap-3">
      <span className="w-10 h-10 flex items-center justify-center rounded-lg
        bg-gray-50 border border-gray-100 text-sm font-medium text-gray-700">
        {tamanho.name}
      </span>
    </div>

    <div className="flex items-center gap-1.5">
      <ButtonEditList onEditar={ onEditar ?? (()=> {}) }/>
        
      <button
        onClick={() => onDeletar(tamanho.uuid)}
        title="Deletar"
        className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg text-gray-400
          hover:text-red-500 hover:bg-red-50 transition-colors duration-150"
      >
        <TrashIcon />
      </button>
    </div>
  </div>
);

export default SizeCard;