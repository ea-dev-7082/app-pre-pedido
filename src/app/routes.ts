import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Orcamentos } from "./pages/Orcamentos";
import { PedidosFechados } from "./pages/PedidosFechados";
import { Importacao } from "./pages/Importacao";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Orcamentos },
      { path: "pedidos-fechados", Component: PedidosFechados },
      { path: "importacao", Component: Importacao },
    ],
  },
]);
