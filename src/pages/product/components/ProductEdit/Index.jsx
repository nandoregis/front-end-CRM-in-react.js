import { useEffect, useState } from "react";
import BackIcon from "../../../../components/svg/BackIcon";
import Api from "../../../../services/Api";
import { useParams } from "react-router-dom";
import { useToast } from "../../../../context/ToastContext";

const ProductEdit = ({ onVoltar }) => {
    
    const {uuid} = useParams();
    const {addToast} = useToast();

    const [salvando, setSalvando] = useState(false);
    const [sucesso, setSucesso] = useState(false);
    const [produto, setProduto] = useState([]);

    const [form, setForm] = useState({
        name: "",
        reference: "",
    });
    
    useEffect(() => {
        const carregar = async () => {
            try {
                const res = await Api.get(`/v1/produtos/${uuid}`);
                const data = res.data.data;

                if(data.length === 0) {
                    addToast('error', 'Produto não encontrado.');
                    return;
                }
                setProduto(res.data.data);
                setForm({
                    name: res.data.data.name,
                    reference: res.data.data.reference,
                });

            } catch (error) {
                addToast('error', 'Erro ao carregar produto.');
            }
        };
        carregar();
    },[]);
        
            

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSucesso(false);
        setSalvando(true);

        const atualizar = async () => {
            try {
                // update
                await Api.put(`/v1/produtos/u/update/${uuid}`, {
                    name: form.name,
                    reference: form.reference,
                });
                setSucesso(true);
                addToast('success', 'Atualizado com sucesso!');
            } catch (err) {
                const errorMessage = typeof err.response.data.message == 'string' ? err.response.data.message : 'Houve um erro e não conseguiu atualizar';
                addToast('error', errorMessage);
            } finally {
                setSalvando(false);
            }
        }

        atualizar();
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
            <h1 className="text-base font-medium text-gray-900">Editar produto</h1>
            <p className="text-sm text-gray-500 mt-0.5 font-mono">{produto?.reference}</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Campos */}
            <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-4">
            <p className="text-sm font-medium text-gray-700">Dados do produto</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500">Nome</label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
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
                    value={form.reference}
                    onChange={handleChange}
                    placeholder="Ex: 01092"
                    required
                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900
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
                {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
            </div>

        </form>
        </div>
    );
};

export default ProductEdit;