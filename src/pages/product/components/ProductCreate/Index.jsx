import { useState, useEffect } from "react";
import Api from "../../../../services/Api";
import PlusIcon from "../../../../components/svg/PlusIcon";
import TrashIcon from "../../../../components/svg/TrashIcon";
import BackIcon from "../../../../components/svg/BackIcon";
import { useToast } from "../../../../context/ToastContext";

const varianteVazia = () => ({
  _id: Date.now() + Math.random(),
  color_uuid: "",
  size_uuid: "",
  price: "",
  barcode: "",
});

const ProductCreate = ({ onVoltar }) => {

    const { addToast } = useToast();

    const [cores, setCores] = useState([]);
    const [tamanhos, setTamanhos] = useState([]);
    const [loadingOpcoes, setLoadingOpcoes] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState(null);

    const [form, setForm] = useState({
        name: "",
        reference: "",
        variations: [varianteVazia()],
    });

  useEffect(() => {
    const carregar = async () => {
      try {
        const [resCores, resTamanhos] = await Promise.all([
          Api.get("/v1/colors"),
          Api.get("/v1/sizes"),
        ]);

        setCores(resCores.data.data);
        setTamanhos(resTamanhos.data.data);
       
      } catch (err){

        const codeError = err.response.data.code;
        const attempt_in = err.response.data.attempt_in;

        if(codeError === 429) {
            setLoadingOpcoes(true);
            addToast('warning', "Muitas requisições. Tente novamente em " + attempt_in + " segundos.");
            setTimeout(() => {
                carregar();
                setLoadingOpcoes(false)
            }, attempt_in * 1000);
        }
       
        setCores([]);
        setTamanhos([]);
        
      } finally {
       setLoadingOpcoes(false)
      }
    };
    carregar();
  }, []);

  // ─── Form principal ──────────────────────────────────────────────────────────
  const handleForm = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // ─── Variantes ───────────────────────────────────────────────────────────────
  const handleVariante = (_id, campo, valor) => {
    setForm((p) => ({
      ...p,
      variations: p.variations.map((v) =>
        v._id === _id ? { ...v, [campo]: valor } : v
      ),
    }));
  };

  const adicionarVariante = () => {
    setForm((p) => ({ ...p, variations: [...p.variations, varianteVazia()] }));
  };

  const removerVariante = (_id) => {
    setForm((p) => ({
      ...p,
      variations: p.variations.filter((v) => v._id !== _id),
    }));
  };

  // ─── Preview das variantes preenchidas ───────────────────────────────────────
  const variantesValidas = form.variations.filter((v) => v.color_uuid && v.size_uuid);

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setSalvando(true);

    const payload = {
      name: form.name,
      reference: form.reference,
      variations: form.variations.map(({ color_uuid, size_uuid, price }) => ({
        color_uuid,
        size_uuid,
        price: parseFloat(price).toFixed(2).replace(".", ",")  || "0,00"
      })),
    };

    console.log(payload);

    try {
      await Api.post("/v1/produtos/c/create", payload);
      addToast('success', 'Produto cadastrado com sucesso!');
      onVoltar?.();
    } catch (err) {
        console.log(err.response)
        const errorMessage = err.response.data.message;
        var message = "";

        if(typeof errorMessage != 'string') {
            for (const key in errorMessage) {
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
          <h1 className="text-base font-medium text-gray-900">Novo produto</h1>
          <p className="text-sm text-gray-500 mt-0.5">Preencha os dados para cadastrar</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Dados principais */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-4">
          <p className="text-sm font-medium text-gray-700">Dados do produto</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500">Nome</label>
              <input
                type="text"
                name="name"
                value={form?.name}
                onChange={handleForm}
                placeholder="Ex: Camisa Algodão"
                required
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900
                  outline-none focus:border-blue-400 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500">Referência</label>
              <input
                type="text"
                name="reference"
                value={form?.reference}
                onChange={handleForm}
                placeholder="Ex: 01092"
                required
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900
                  outline-none focus:border-blue-400 transition-colors font-mono"
              />
            </div>
          </div>
        </div>

        {/* Variantes */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Variantes</p>
            <span className="text-xs text-gray-400">{form.variations.length} linha(s)</span>
          </div>

          {/* Cabeçalho colunas */}
          <div className="grid grid-cols-[1fr_1fr_100px_130px_32px] gap-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Cor</span>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Tamanho</span>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Preço</span>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Cód. barras</span>
            <span />
          </div>

          {/* Linhas */}
          <div className="flex flex-col gap-2">
            {form?.variations?.map((v) => (
              <div key={v._id} className="grid grid-cols-[1fr_1fr_100px_130px_32px] gap-2 items-center">

                {/* Cor */}
                <select
                  value={v.color_uuid}
                  onChange={(e) => handleVariante(v._id, "color_uuid", e.target.value)}
                  required
                  disabled={loadingOpcoes}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900
                    outline-none focus:border-blue-400 transition-colors bg-white"
                >
                  <option value="">Selecione</option>
                  {cores?.map((c) => (
                    <option key={c.uuid} value={c.uuid}>{c.name}</option>
                  ))}
                </select>

                {/* Tamanho */}
                <select
                  value={v.size_uuid}
                  onChange={(e) => handleVariante(v._id, "size_uuid", e.target.value)}
                  required
                  disabled={loadingOpcoes}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900
                    outline-none focus:border-blue-400 transition-colors bg-white"
                >
                  <option value="">Selecione</option>
                  {tamanhos?.map((t) => (
                    <option key={t.uuid} value={t.uuid}>{t.name}</option>
                  ))}
                </select>

                {/* Preço */}
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={v.price}
                  onChange={(e) => handleVariante(v._id, "price", e.target.value)}
                  placeholder="0,00"
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900
                    outline-none focus:border-blue-400 transition-colors"
                />

                {/* Código de barras */}
                <input
                  type="text"
                  value={v.barcode}
                  onChange={(e) => handleVariante(v._id, "barcode", e.target.value)}
                  placeholder="7890000000000"
                  maxLength={13}
                  disabled={true}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900
                    outline-none focus:border-blue-400 transition-colors font-mono"
                />

                {/* Remover */}
                <button
                  type="button"
                  onClick={() => removerVariante(v._id)}
                  disabled={form.variations.length === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400
                    hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>

          {/* Preview variantes preenchidas */}
          {variantesValidas.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-100">
              {variantesValidas.map((v) => {
                const cor = cores.find((c) => c.uuid === v.color_uuid);
                const tam = tamanhos.find((t) => t.uuid === v.size_uuid);
                return (
                  <span key={v._id}
                    className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                    {cor?.hex && (
                      <span className="inline-block w-2.5 h-2.5 rounded-full border border-blue-200 flex-shrink-0"
                        style={{ background: cor.hex }} />
                    )}
                    {cor?.name} · {tam?.name}
                    {v.price && parseFloat(v.price) > 0 && (
                      <span className="text-blue-500 ml-1">
                        R$ {parseFloat(v.price).toFixed(2).replace(".", ",")}
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          )}

          {/* Adicionar linha */}
          <button
            type="button"
            onClick={adicionarVariante}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700
              transition-colors w-fit"
          >
            <PlusIcon />
            Adicionar variante
          </button>
        </div>

        {/* Erro */}
        {erro && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
            {erro}
          </p>
        )}

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
            disabled={salvando}
            className="text-sm px-5 py-2.5 rounded-lg bg-blue-600 text-white
              hover:bg-blue-700 active:scale-95 transition-all duration-150
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {salvando ? "Salvando..." : "Salvar produto"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ProductCreate;