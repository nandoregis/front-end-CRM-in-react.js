import { useState } from "react";
import Api from "../../../../services/Api";
import { useToast } from "../../../../context/ToastContext";
import BackIcon from "../../../../components/svg/BackIcon";

const ColorCreate = ({ onVoltar }) => {
  const [form, setForm] = useState({ name: "", hex: "#000000" });
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const {addToast} = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSucesso(false);
    setSalvando(true);

    try {
      await Api.post("/v1/colors/c/create", {
        name: form.name,
        color_hex: form.hex,
      });

        addToast('success','Cor cadastrada com sucesso!');
        setTimeout(() => onVoltar?.(), 1000);
    } catch (error) {
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
          <h1 className="text-base font-medium text-gray-900">Nova cor</h1>
          <p className="text-sm text-gray-500 mt-0.5">Cadastre uma nova cor para os produtos</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-5">

          <p className="text-sm font-medium text-gray-700">Dados da cor</p>

          {/* Preview */}
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl border border-gray-200 flex-shrink-0 transition-colors duration-200"
              style={{ background: form.hex }}
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-gray-900">
                {form.name || "Nome da cor"}
              </span>
              <span className="text-xs font-mono text-gray-400">{form.hex}</span>
            </div>
          </div>

          {/* Nome */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500">Nome</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ex: Branco, Azul Marinho..."
              required
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900
                outline-none focus:border-blue-400 transition-colors"
            />
          </div>

          {/* Cor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500">Cor</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="hex"
                value={form.hex}
                onChange={handleChange}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
              />
              <input
                type="text"
                name="hex"
                value={form.hex}
                onChange={handleChange}
                placeholder="#000000"
                maxLength={7}
                pattern="^#[0-9A-Fa-f]{6}$"
                required
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900
                  outline-none focus:border-blue-400 transition-colors font-mono"
              />
            </div>
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
            {salvando ? "Salvando..." : "Salvar cor"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ColorCreate;