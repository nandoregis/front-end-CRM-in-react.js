import { useState } from "react";
import Api from "../../../../services/Api";
import BackIcon from "../../../../components/svg/BackIcon";
import { useToast } from "../../../../context/ToastContext";

const SizeCreate = ({ onVoltar }) => {
  const [name, setName] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);
  const {addToast} = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setSucesso(false);
    setSalvando(true);

    try {
      await Api.post("/v1/sizes/c/create", { name });
      setSucesso(true);
      addToast('success',"Tamanho salvo com sucesso!")
      setTimeout(() => onVoltar?.(), 3000);
    } catch {
      const errorMessage = error.response.data.message;
        var message = errorMessage;
        if(typeof errorMessage != 'string') {
            for(const key in errorMessage) {
                message = errorMessage[key];
            }
        }
        addToast('error', message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onVoltar}
          className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg text-gray-400
            hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <BackIcon />
        </button>
        <div>
          <h1 className="text-base font-medium text-gray-900">Novo tamanho</h1>
          <p className="text-sm text-gray-500 mt-0.5">Cadastre um novo tamanho para os produtos</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-4">

          <p className="text-sm font-medium text-gray-700">Dados do tamanho</p>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: P, M, G, GG, 42..."
              required
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900
                outline-none focus:border-blue-400 transition-colors"
            />
          </div>

        </div>

        {/* Ações */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onVoltar}
            className="cursor-pointer text-sm px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600
              hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={salvando || sucesso}
            className="cursor-pointer text-sm px-5 py-2.5 rounded-lg bg-blue-600 text-white
              hover:bg-blue-700 active:scale-95 transition-all duration-150
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {salvando ? "Salvando..." : "Salvar tamanho"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default SizeCreate;