import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 bg-gray-900">
      
      <h1 className="text-7xl font-extrabold text-gray-500">
        404
      </h1>

      <p className="mt-4 text-xl text-gray-600">
        Página não encontrada
      </p>

      <p className="mt-2 text-gray-500 text-center max-w-md">
        O recurso que você está tentando acessar não existe ou foi removido.
      </p>


      <div
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-md hover:bg-blue-700 transition"
      >
        <Link to='/entrar'>Voltar</Link>
      </div>

    </div>
  );
}