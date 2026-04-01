import { Outlet, NavLink } from "react-router";
import { FileText, CheckCircle, Import, Search, Sparkles } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function Layout() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-72 border-r border-sidebar-border bg-gradient-to-b from-white to-gray-50/50 flex flex-col shadow-sm">
        {/* Logo/Header */}
        <div className="p-6 border-b border-sidebar-border bg-gradient-to-r from-blue-600 to-blue-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">
                AutoPeças Pro
              </h1>
              <p className="text-xs text-blue-100 mt-0.5">Sistema de Pedidos</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : "text-gray-700 hover:bg-gray-100 hover:translate-x-1"
              }`
            }
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Orçamentos</span>
          </NavLink>

          <NavLink
            to="/pedidos-fechados"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : "text-gray-700 hover:bg-gray-100 hover:translate-x-1"
              }`
            }
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Pedidos Fechados</span>
          </NavLink>

          <NavLink
            to="/importacao"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : "text-gray-700 hover:bg-gray-100 hover:translate-x-1"
              }`
            }
          >
            <Import className="w-5 h-5" />
            <span className="font-medium">Importação</span>
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border bg-gray-50/50">
          <p className="text-xs text-gray-500 text-center">
            © 2026 AutoPeças Pro
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-white/80 backdrop-blur-xl px-8 py-5 flex items-center gap-4 shadow-sm">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar pedidos, clientes..."
              className="pl-12 h-11 bg-gray-50/50 border-gray-200 focus:bg-white rounded-xl shadow-sm"
            />
          </div>
          <Button className="h-11 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30 rounded-xl">
            Novo Pedido
          </Button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}