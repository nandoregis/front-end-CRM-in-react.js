import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicRouteLogin from "./PublicRouteLogin";
import PrivateRoute from "./PrivateRoute";

// pages
import Login from "../pages/login/Index";
import NotFound from "../pages/notFound/Index";
import Dashboard from "../pages/dashboard/Index";
import ProductPage from "../pages/product/Index";
import ProductsList from "../pages/product/components/ProductList/Index";
import ProductCreate from "../pages/product/components/ProductCreate/Index";
import ProductEdit from "../pages/product/components/ProductEdit/Index";
import ColorPage from "../pages/cores/Index";
import ColorList from "../pages/cores/components/ColorList/Index";
import ColorCreate from "../pages/cores/components/ColorCreate/Index";
import ColorEdit from "../pages/cores/components/ColorEdit/Index";
import SizePage from "../pages/sizes/Index";
import SizeList from "../pages/sizes/components/SizeList/Index";
import SizeCreate from "../pages/sizes/components/SizeCreate/Index";
import StockMovement from "../pages/storage/Index";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={
          <>
            <h2>Init page</h2>
          </>
        } />
        
        <Route path="/entrar" element={
          <PublicRouteLogin>
            <Login />
          </PublicRouteLogin>
        } />

        <Route path="/dashboard" element={
          <PrivateRoute activeSidebar={true}>
            <Dashboard />
          </PrivateRoute>
        } />

        <Route path="/produtos" element={
          <PrivateRoute activeSidebar={true}>
            <ProductPage>
              <ProductsList/>
            </ProductPage>
          </PrivateRoute>
        } />

        <Route path="/produtos/new" element={
          <PrivateRoute activeSidebar={true}>
            <ProductPage>
              <ProductCreate onVoltar = {
                () => {
                  window.history.back();
                }
              }/>
            </ProductPage>
          </PrivateRoute>
        } />

         <Route path="/produtos/edit/:uuid" element={
          <PrivateRoute activeSidebar={true}>
            <ProductPage>
              <ProductEdit onVoltar = {
                () => {
                  window.history.back();
                }
              }/>
            </ProductPage>
          </PrivateRoute>
        } />

        <Route path="/cores" element={
          <PrivateRoute activeSidebar={true}>
            <ColorPage>
              <ColorList/>
            </ColorPage>
          </PrivateRoute>
        } />

        <Route path="/cores/new" element={
          <PrivateRoute activeSidebar={true}>
            <ColorPage>
              <ColorCreate onVoltar={() => { window.history.back() }}/>
            </ColorPage>
          </PrivateRoute>
        } />

        <Route path="/cores/edit/:uuid" element={
          <PrivateRoute activeSidebar={true}>
            <ColorPage>
              <ColorEdit onVoltar={() => { window.history.back() }}/>
            </ColorPage>
          </PrivateRoute>
        } />

        <Route path="/tamanhos" element={
          <PrivateRoute activeSidebar={true}>
            <SizePage>
              <SizeList/>
            </SizePage>
          </PrivateRoute>
        } />

        <Route path="/tamanhos/new" element={
          <PrivateRoute activeSidebar={true}>
            <SizePage>
              <SizeCreate onVoltar={() => { window.history.back() }}/>
            </SizePage>
          </PrivateRoute>
        } />

          <Route path="/movimentacao" element={
          <PrivateRoute activeSidebar={true}>
            <StockMovement/>
          </PrivateRoute>
        } />

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
} 