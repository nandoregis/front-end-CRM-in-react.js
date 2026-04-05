import { useEffect, useState } from "react";
import Api from "../../services/Api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const produtos = [
  { nome: "Plano Pro", vendas: 412, estoque: "—", total: 24720, status: "OK" },
  { nome: "Camiseta Premium", vendas: 298, estoque: 540, total: 14900, status: "OK" },
  { nome: "Mochila Urban", vendas: 187, estoque: 94, total: 13090, status: "Baixo" },
  { nome: "Caneca Térmica", vendas: 243, estoque: 820, total: 7290, status: "OK" },
  { nome: "Caderno A5", vendas: 144, estoque: 18, total: 2400, status: "Crítico" },
];

const vendasSemana = [
  { dia: "Seg", vendas: 142 },
  { dia: "Ter", vendas: 198 },
  { dia: "Qua", vendas: 165 },
  { dia: "Qui", vendas: 221 },
  { dia: "Sex", vendas: 267 },
  { dia: "Sáb", vendas: 183 },
  { dia: "Dom", vendas: 108 },
];

const statusConfig = {
  OK: "bg-green-100 text-green-800",
  Baixo: "bg-amber-100 text-amber-800",
  Crítico: "bg-red-100 text-red-800",
};

const totais = [
  { label: "Produtos", valor: "38", delta: "▲ 3 novos", positivo: true },
  { label: "Vendas", valor: "1.284", delta: "▲ 11%", positivo: true },
  { label: "Estoque", valor: "4.730", delta: "▼ 8% giro", positivo: false },
  { label: "Total", valor: "R$ 62.400", delta: "▲ 14%", positivo: true },
];

export default function Dashboard() {
  const [periodo, setPeriodo] = useState("7 dias");
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    const response = await Api.get('/v1/produtos');
    return response.data.data;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getProducts();
        setProducts(data);   
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    // loadData();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans">
      <div className="mx-auto flex flex-col gap-6 p-6">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-medium text-gray-900">Dashboard de produtos</h1>
            <p className="text-sm text-gray-500 mt-0.5">Abril 2026</p>
          </div>
          <div className="flex gap-2">
            {["7 dias", "30 dias", "90 dias"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriodo(p)}
                className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                  periodo === p
                    ? "bg-white border-gray-300 text-gray-900 shadow-sm"
                    : "border-gray-200 text-gray-500 hover:bg-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Cards de totais */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {totais.map((t) => (
            <div key={t.label} className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">{t.label}</p>
              <p className="text-xl font-medium text-gray-900">{t.valor}</p>
              <p className={`text-xs mt-1 ${t.positivo ? "text-green-700" : "text-red-600"}`}>
                {t.delta}
              </p>
            </div>
          ))}
        </div>

        {/* Tabela de produtos */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-medium text-gray-900">Produtos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Produto</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide text-right">Vendas</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide text-right">Estoque</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide text-right">Total</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((p, i) => (
                  <tr key={i} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-gray-900 font-medium">{p.nome}</td>
                    <td className="px-5 py-3 text-gray-700 text-right">{p.vendas}</td>
                    <td className="px-5 py-3 text-gray-700 text-right">{p.estoque}</td>
                    <td className="px-5 py-3 text-gray-700 text-right">
                      {typeof p.total === "number"
                        ? `R$ ${p.total.toLocaleString("pt-BR")}`
                        : p.total}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full font-medium ${statusConfig[p.status]}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gráfico de vendas */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Vendas por dia</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={vendasSemana} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="dia"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
              />
              <Tooltip
                contentStyle={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}
                cursor={{ fill: "#f9fafb" }}
              />
              <Bar dataKey="vendas" fill="#93c5fd" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}