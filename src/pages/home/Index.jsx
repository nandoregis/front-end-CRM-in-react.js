import React from 'react';

// --- SVGs Minimalistas ---
const IconRocket = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-indigo-600">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3m3 3l8.5-8.5M12 15l-3 3m8.5-8.5c1.2-1.2 1.4-3.4 1.4-3.4s-2.2.2-3.4 1.4L8.5 16.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconCode = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <polyline points="16 18 22 12 16 6" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="8 6 2 12 8 18" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      
      {/* Badge de Status */}
      <div className="mb-8 flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
        </span>
        <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Em Desenvolvimento</span>
      </div>

      {/* Conteúdo Principal */}
      <main className="max-w-2xl text-center space-y-6">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-indigo-100 rounded-3xl">
            <IconRocket />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          O futuro do seu <span className="text-indigo-600">ponto de venda</span> está chegando.
        </h1>
        
        <p className="text-lg text-slate-500 leading-relaxed max-w-lg mx-auto">
          Estamos construindo um PDV extremamente rápido, simples e focado na experiência do usuário. 
          Menos cliques, mais vendas.
        </p>

        {/* Mini lista de promessas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mt-10">
          <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-emerald-500"><IconCode /></div>
            <span className="text-sm font-semibold text-slate-700">Interface Intuitiva</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-orange-500"><IconCode /></div>
            <span className="text-sm font-semibold text-slate-700">Gestão Descomplicada</span>
          </div>
        </div>
      </main>

      {/* Rodapé Simples */}
      <footer className="mt-20 text-slate-400 flex flex-col items-center gap-4">
        <p className="text-sm">Quer saber quando lançarmos?</p>
        <div className="flex gap-2">
          <input 
            type="email" 
            placeholder="Seu melhor e-mail" 
            className="px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800 transition">
            Avisar-me
          </button>
        </div>
      </footer>

    </div>
  );
}