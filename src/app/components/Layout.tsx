import { Outlet, NavLink, useNavigate } from "react-router";
import { FileText, CheckCircle, Import, Search, PlusCircle, Sun, Moon } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import logoComkit from "../../assets/logo-comkit.jpg";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Layout() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita hidratação incorreta
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-72 border-r border-sidebar-border bg-sidebar flex flex-col shadow-sm">
        {/* Logo/Header */}
        <div className="p-6 border-b border-sidebar-border bg-gradient-to-r from-blue-600 to-blue-500">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shadow-lg border-2 border-white/20">
              <img src={logoComkit} alt="Comkit Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Comkit
              </h1>
              <p className="text-[10px] text-blue-100/80 uppercase tracking-widest font-bold">Sistema de Pré-Pedidos</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:translate-x-1"
              }`
            }
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Orçamentos</span>
          </NavLink>

          <NavLink
            to="/pedidos-fechados"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:translate-x-1"
              }`
            }
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Pedidos Fechados</span>
          </NavLink>

          <NavLink
            to="/importacao"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:translate-x-1"
              }`
            }
          >
            <Import className="w-5 h-5" />
            <span className="font-medium">Importação</span>
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border bg-sidebar">
          <p className="text-xs text-sidebar-foreground/60 text-center">
            © 2026 Comkit
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-background/80 backdrop-blur-xl px-8 py-5 flex items-center gap-4 shadow-sm z-10">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar pedidos, clientes..."
              className="pl-12 h-11 bg-muted/50 border-border focus:bg-background rounded-xl shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-3">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-11 h-11 rounded-xl text-foreground hover:bg-muted"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            )}
            
            <Button
              onClick={() => navigate("/?new=true")}
              className="h-11 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30 rounded-xl gap-2 text-white border-0"
            >
              <PlusCircle className="w-4 h-4" />
              Novo Pedido
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}