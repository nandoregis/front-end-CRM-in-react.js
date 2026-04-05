import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const Icons = {
  dashboard:    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  cadastros:    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2 M9 5a2 2 0 012-2h2a2 2 0 012 2",
  produto:      "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z",
  cores:        "M12 2a10 10 0 100 20 10 10 0 000-20z M2 12h20 M12 2a15.3 15.3 0 010 20 M12 2a15.3 15.3 0 000 20",
  tamanhos:     "M21 21H3 M21 3v18 M3 3l18 18",
  estoque:      "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4",
  movimentacao: "M7 16V4m0 0L3 8m4-4l4 4 M17 8v12m0 0l4-4m-4 4l-4-4",
  pdv:          "M3 3h18v4H3z M3 10h18v11H3z M8 10v11 M16 10v11",
  chevron:      "M9 18l6-6-6-6",
  menu:         "M3 12h18 M3 6h18 M3 18h18",
  close:        "M18 6L6 18 M6 6l12 12",
};

const nav = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard", route:"/dashboard" },
  {
    id: "cadastros", label: "Cadastros", icon: "cadastros",
    children: [
      { id: "produtos",  label: "Produtos",  icon: "produto", route:"/produtos" },
      { id: "cores",     label: "Cores",     icon: "cores", route:"/cores" },
      { id: "tamanhos",  label: "Tamanhos",  icon: "tamanhos", route:"/tamanhos" },
    ],
  },
  {
    id: "estoque", label: "Estoque", icon: "estoque",
    children: [
      { id: "movimentacao", label: "Movimentação", icon: "movimentacao", route:"/movimentacao" },
    ],
  },
  { id: "pdv", label: "PDV", icon: "pdv" },
];

export default function Sidebar({ active, setActive }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState({ cadastros: false, estoque: false });
  const navigate = useNavigate();

  const toggle = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const NavItem = ({ item, depth = 0 }) => {
    const hasChildren = item.children?.length > 0;
    const isActive = active === item.id;
    const isExpanded = expanded[item.id];

    return (
      <div>
        <button
          onClick={() => {
            if (hasChildren) toggle(item.id);
            else { 
              setActive = item.id; 
              setOpen(false);
              navigate(item.route);
            }
          }}
          className={`cursor-pointer
            flex items-center gap-2.5 py-2 px-3 rounded-lg text-sm w-full transition-colors
            ${depth > 0 ? "ml-5 w-[calc(100%-1.25rem)]" : ""}
            ${isActive
              ? "bg-blue-50 text-blue-700 font-medium"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
          `}
        >
          <span className={isActive ? "text-blue-600" : "text-gray-400"}>
            <Icon d={Icons[item.icon]} size={15} />
          </span>
          <span className="flex-1 text-left">{item.label}</span>
          {hasChildren && (
            <span className={`text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}>
              <Icon d={Icons.chevron} size={13} />
            </span>
          )}
        </button>

        {hasChildren && isExpanded && (
          <div className="mt-0.5 flex flex-col gap-0.5">
            {item.children.map((child) => (
              <NavItem key={child.id} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Botão hamburguer — mobile */}
      <button
        className="fixed top-4 left-4 z-40 lg:hidden bg-white border border-gray-200 rounded-lg p-2 text-gray-500 hover:text-gray-800 shadow-sm"
        onClick={() => setOpen(true)}
      >
        <Icon d={Icons.menu} size={18} />
      </button>

      {/* Overlay — mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-56 bg-white border-r border-gray-100 z-30
        flex flex-col transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <span className="text-base font-medium text-gray-900">Minha Loja</span>
          <button
            className="lg:hidden text-gray-400 hover:text-gray-700"
            onClick={() => setOpen(false)}
          >
            <Icon d={Icons.close} size={16} />
          </button>
        </div>

        {/* Navegação */}
        <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-0.5">
          {nav.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          v1.0.0
        </div>
      </aside>
    </>
  );
}