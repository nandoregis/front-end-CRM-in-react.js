import EditIcon from "../svg/EditIcon";

const ButtonEditList = ({onEditar}) => {

    return(
        <button
            onClick={onEditar ?? (() => {})}
            title="Editar"
            className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg text-gray-400
            hover:text-blue-600 hover:bg-blue-50 transition-colors duration-150"
        >
            <EditIcon />
      </button>
    );
}

export default ButtonEditList;