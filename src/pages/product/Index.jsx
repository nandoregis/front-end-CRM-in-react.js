

const ProductPage = ({children}) =>  {


    return(<>
        <div className="min-h-screen w-full bg-gray-50 font-sans">
           {  
            // header aqui
           }
            <div className="w-full bg-white border-b border-gray-100 px-6 py-4">
                <h1 className="text-base font-medium text-gray-900">Produtos</h1>
                <p className="text-sm text-gray-500 mt-0.5">Gerencie seus produtos</p>
            </div>

             <div className="p-6">
               {children}
            </div>
        </div>
    </>);

}

export default ProductPage;