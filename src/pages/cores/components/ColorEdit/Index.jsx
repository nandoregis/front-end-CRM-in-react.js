import { useEffect, useState } from "react";
import Api from "../../../../services/Api";
import BackIcon from "../../../../components/svg/BackIcon";
import { useParams } from "react-router-dom";
import { useToast } from "../../../../context/ToastContext";

const ColorEdit = ({ onVoltar }) => {
    const [cor, setCor] = useState([]);
    const [salvando, setSalvando] = useState(false);
    const [sucesso, setSucesso] = useState(false);
    const {uuid} = useParams();
    const [form, setForm] = useState({ name: cor?.name ?? "" });
    const {addToast} = useToast();

    useEffect(() => {
        const load = async () => {
            try {
                const res = await Api.get(`/v1/colors/${uuid}`);
                setCor(res.data.data);
                setForm({ name: res.data.data.name });
            } catch (error) {
                const errorMessage = error.response.data.message;
                var message = errorMessage;
                if(typeof errorMessage != 'string') {
                    for(const key in errorMessage) {
                        message = errorMessage[key];
                    }
                }
                addToast('error', message);
            }
        }

        load();
    },[]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    alert('Ainda em desenvolvimento do endpoint');

    return;
  
    setSucesso(false);
    setSalvando(true);

    try {
      await Api.put(`/v1/colors/u/update/${cor.uuid}`, { name: form.name });
      setSucesso(true);
      setTimeout(() => onVoltar?.(), 1000);
    } catch (error) {
        console.log(error.response);
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
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400
            hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <BackIcon />
        </button>
        <div>
          <h1 className="text-base font-medium text-gray-900">Editar cor</h1>
          <p className="text-sm text-gray-500 mt-0.5 font-mono">{cor?.color_hex}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-5">

          <p className="text-sm font-medium text-gray-700">Dados da cor</p>

          {/* Preview */}
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl border border-gray-200 flex-shrink-0"
              style={{ background: cor?.color_hex }}
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-gray-900">
                {form.name || cor?.name}
              </span>
              <span className="text-xs font-mono text-gray-400">{cor?.color_hex}</span>
            </div>
          </div>

          {/* Nome */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500">Nome</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ name: e.target.value })}
              placeholder="Ex: Azul Marinho"
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
            className="text-sm px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600
              hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={salvando || sucesso}
            className="text-sm px-5 py-2.5 rounded-lg bg-blue-600 text-white
              hover:bg-blue-700 active:scale-95 transition-all duration-150
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {salvando ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ColorEdit;