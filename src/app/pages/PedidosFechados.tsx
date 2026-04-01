import { useState } from "react";
import { Download, FileSpreadsheet, CheckCircle2, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";

type ExportStatus = "exportado" | "pendente";

interface ClosedOrder {
  id: string;
  cliente: string;
  data: string;
  valorTotal: number;
  status: ExportStatus;
  itensCount: number;
}

const mockClosedOrders: ClosedOrder[] = [
  {
    id: "C001",
    cliente: "Auto Center Silva",
    data: "2026-03-20",
    valorTotal: 15890.50,
    status: "exportado",
    itensCount: 12,
  },
  {
    id: "C002",
    cliente: "Oficina Mecânica Santos",
    data: "2026-03-19",
    valorTotal: 8450.00,
    status: "pendente",
    itensCount: 8,
  },
  {
    id: "C003",
    cliente: "Posto Rodoviário Ltda",
    data: "2026-03-18",
    valorTotal: 23500.00,
    status: "exportado",
    itensCount: 20,
  },
  {
    id: "C004",
    cliente: "Distribuidora Automotiva",
    data: "2026-03-17",
    valorTotal: 45600.00,
    status: "exportado",
    itensCount: 35,
  },
  {
    id: "C005",
    cliente: "Mecânica Central",
    data: "2026-03-16",
    valorTotal: 6780.00,
    status: "pendente",
    itensCount: 5,
  },
];

export function PedidosFechados() {
  const [orders] = useState<ClosedOrder[]>(mockClosedOrders);
  const [searchTerm, setSearchTerm] = useState("");

  const handleExport = (orderId: string) => {
    console.log("Exportando pedido:", orderId);
    // Lógica de exportação
  };

  const filteredOrders = orders.filter((order) =>
    order.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = filteredOrders.reduce((sum, order) => sum + order.valorTotal, 0);
  const pendingCount = filteredOrders.filter((o) => o.status === "pendente").length;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Pedidos Fechados</h1>
        <p className="text-gray-500 mt-2 text-lg">
          Histórico de pedidos finalizados e exportações
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 border-0 shadow-lg hover:shadow-xl transition-shadow rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total de Pedidos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{filteredOrders.length}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <FileSpreadsheet className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-green-100/50 border-0 shadow-lg hover:shadow-xl transition-shadow rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-medium">Valor Total</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                R$ {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-100/50 border-0 shadow-lg hover:shadow-xl transition-shadow rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Pendentes Exportação</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{pendingCount}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Clock className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="p-5 border-0 shadow-lg rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Buscar por cliente ou número do pedido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-50 border-gray-200 h-11 rounded-xl"
            />
          </div>
          <Button variant="outline" className="gap-2 h-11 px-5 rounded-xl border-2 hover:border-blue-500 hover:bg-blue-50">
            <Download className="w-4 h-4" />
            Exportar Todos
          </Button>
        </div>
      </Card>

      {/* Tabela */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b-2 border-gray-200">
              <tr>
                <th className="text-left p-5 font-semibold text-sm text-gray-700">Nº Pedido</th>
                <th className="text-left p-5 font-semibold text-sm text-gray-700">Cliente</th>
                <th className="text-left p-5 font-semibold text-sm text-gray-700">Data</th>
                <th className="text-right p-5 font-semibold text-sm text-gray-700">Itens</th>
                <th className="text-right p-5 font-semibold text-sm text-gray-700">Valor Total</th>
                <th className="text-center p-5 font-semibold text-sm text-gray-700">Status</th>
                <th className="text-center p-5 font-semibold text-sm text-gray-700 w-32">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredOrders.map((order, index) => (
                <tr key={order.id} className={`border-b border-gray-100 last:border-0 hover:bg-blue-50/30 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                  <td className="p-5">
                    <span className="font-mono font-semibold text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg">{order.id}</span>
                  </td>
                  <td className="p-5">
                    <span className="font-semibold text-gray-900">{order.cliente}</span>
                  </td>
                  <td className="p-5">
                    <span className="text-gray-500">
                      {new Date(order.data).toLocaleDateString("pt-BR")}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <span className="text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg font-medium">{order.itensCount}</span>
                  </td>
                  <td className="p-5 text-right font-bold text-gray-900 text-lg">
                    R$ {order.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-5 text-center">
                    {order.status === "exportado" ? (
                      <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-sm">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Exportado
                      </Badge>
                    ) : (
                      <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-sm">
                        <Clock className="w-3 h-3 mr-1" />
                        Pendente
                      </Badge>
                    )}
                  </td>
                  <td className="p-5 text-center">
                    <Button
                      size="sm"
                      variant={order.status === "exportado" ? "outline" : "default"}
                      onClick={() => handleExport(order.id)}
                      className={`gap-2 rounded-xl ${order.status === "exportado" ? "border-2 hover:border-blue-500 hover:bg-blue-50" : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md"}`}
                    >
                      <Download className="w-4 h-4" />
                      {order.status === "exportado" ? "Reexportar" : "Exportar"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-16 text-center bg-gray-50/50">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 mx-auto mb-4 flex items-center justify-center">
              <FileSpreadsheet className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">Nenhum pedido encontrado</p>
          </div>
        )}
      </Card>
    </div>
  );
}