import { useState } from "react";
import { Mail, MessageSquare, Trash2, Save, Calculator, CheckCircle2 } from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";
import { PriceBadge } from "../components/PriceBadge";
import { DiscountSuggestion } from "../components/DiscountSuggestion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";

type PriceType = "normal" | "oferta" | "lote";
type Status = "novo" | "em-analise";

interface OrderItem {
  id: string;
  produto: string;
  quantidade: number;
  precoUnitario: number;
  tipoPreco: PriceType;
  total: number;
  suggestQuantity?: number;
  suggestPrice?: number;
}

interface Order {
  id: string;
  cliente: string;
  origem: "whatsapp" | "email";
  data: string;
  status: Status;
  items: OrderItem[];
}

const mockOrders: Order[] = [
  {
    id: "1",
    cliente: "Auto Center Silva",
    origem: "whatsapp",
    data: "2026-03-24",
    status: "novo",
    items: [
      {
        id: "1",
        produto: "Filtro de Óleo Mann W67/2",
        quantidade: 10,
        precoUnitario: 25.90,
        tipoPreco: "normal",
        total: 259.00,
        suggestQuantity: 20,
        suggestPrice: 22.50,
      },
      {
        id: "2",
        produto: "Pastilha de Freio Cobreq",
        quantidade: 15,
        precoUnitario: 89.90,
        tipoPreco: "oferta",
        total: 1348.50,
      },
    ],
  },
  {
    id: "2",
    cliente: "Oficina Mecânica Santos",
    origem: "email",
    data: "2026-03-23",
    status: "em-analise",
    items: [
      {
        id: "3",
        produto: "Óleo Motor 5W30 Mobil",
        quantidade: 50,
        precoUnitario: 45.00,
        tipoPreco: "lote",
        total: 2250.00,
      },
    ],
  },
  {
    id: "3",
    cliente: "Posto Rodoviário Ltda",
    origem: "whatsapp",
    data: "2026-03-22",
    status: "novo",
    items: [
      {
        id: "4",
        produto: "Bateria Moura 60Ah",
        quantidade: 8,
        precoUnitario: 450.00,
        tipoPreco: "normal",
        total: 3600.00,
        suggestQuantity: 12,
        suggestPrice: 420.00,
      },
    ],
  },
];

export function Orcamentos() {
  const [selectedOrder, setSelectedOrder] = useState<Order>(mockOrders[0]);
  const [items, setItems] = useState<OrderItem[]>(selectedOrder.items);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantidade: newQuantity, total: newQuantity * item.precoUnitario }
          : item
      )
    );
  };

  const handleRecalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
    }, 800);
  };

  const handleSave = () => {
    // Lógica de salvar
  };

  const handleCloseOrder = () => {
    // Lógica de fechar pedido
  };

  const handleDeleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const total = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="flex h-full">
      {/* Lista de Pedidos */}
      <div className="w-96 border-r border-border bg-white overflow-y-auto shadow-sm">
        <div className="p-6 border-b border-border bg-gradient-to-br from-gray-50 to-white">
          <h2 className="text-xl font-semibold text-gray-900">Orçamentos em Aberto</h2>
          <p className="text-sm text-gray-500 mt-1">{mockOrders.length} pedidos ativos</p>
        </div>

        <div className="p-3 space-y-3">
          {mockOrders.map((order) => (
            <button
              key={order.id}
              onClick={() => {
                setSelectedOrder(order);
                setItems(order.items);
              }}
              className={`w-full text-left p-4 rounded-2xl transition-all duration-200 ${
                selectedOrder.id === order.id
                  ? "bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-500 shadow-lg shadow-blue-500/10 scale-[1.02]"
                  : "bg-white hover:bg-gray-50 border-2 border-gray-100 hover:border-gray-200 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 truncate pr-2">{order.cliente}</h3>
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    order.origem === "whatsapp" ? "bg-green-100" : "bg-blue-100"
                  }`}
                >
                  {order.origem === "whatsapp" ? (
                    <MessageSquare className="w-4 h-4 text-green-600" />
                  ) : (
                    <Mail className="w-4 h-4 text-blue-600" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {new Date(order.data).toLocaleDateString("pt-BR")}
                </span>
                <StatusBadge status={order.status} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detalhe do Pedido */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/50">
        {/* Header do Pedido */}
        <div className="p-8 border-b border-border bg-white shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-gray-900">{selectedOrder.cliente}</h2>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-sm text-gray-500">
                  {new Date(selectedOrder.data).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <StatusBadge status={selectedOrder.status} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedOrder.origem === "whatsapp" ? (
                <div className="flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-green-500/30">
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/30">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabela de Itens */}
        <div className="flex-1 overflow-auto p-8">
          <Card className="overflow-hidden shadow-lg border-0 rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b-2 border-gray-200">
                  <tr>
                    <th className="text-left p-5 font-semibold text-sm text-gray-700">Produto</th>
                    <th className="text-center p-5 font-semibold text-sm text-gray-700 w-32">Quantidade</th>
                    <th className="text-right p-5 font-semibold text-sm text-gray-700 w-32">Preço Unit.</th>
                    <th className="text-center p-5 font-semibold text-sm text-gray-700 w-32">Tipo</th>
                    <th className="text-right p-5 font-semibold text-sm text-gray-700 w-32">Total</th>
                    <th className="w-16"></th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {items.map((item, index) => (
                    <tr key={item.id} className={`border-b border-gray-100 last:border-0 hover:bg-blue-50/30 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td className="p-5">
                        <div>
                          <p className="font-semibold text-gray-900">{item.produto}</p>
                          {item.suggestQuantity && item.suggestPrice && (
                            <div className="mt-3">
                              <DiscountSuggestion
                                quantity={item.quantidade}
                                targetQuantity={item.suggestQuantity}
                                targetPrice={item.suggestPrice}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-5">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantidade}
                          onChange={(e) =>
                            handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                          }
                          className="text-center bg-white border-gray-200 rounded-xl shadow-sm"
                        />
                      </td>
                      <td className="p-5 text-right font-medium text-gray-900">
                        R$ {item.precoUnitario.toFixed(2)}
                      </td>
                      <td className="p-5 text-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="inline-block">
                                <PriceBadge type={item.tipoPreco} />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {item.tipoPreco === "oferta" && "Produto em promoção especial"}
                                {item.tipoPreco === "lote" && "Preço para compra em lote"}
                                {item.tipoPreco === "normal" && "Preço regular do produto"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                      <td className="p-5 text-right font-bold text-gray-900 text-lg">
                        R$ {item.total.toFixed(2)}
                      </td>
                      <td className="p-5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Footer com Total e Ações */}
        <div className="border-t border-border bg-white p-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleRecalculate}
                disabled={isCalculating}
                className="gap-2 h-11 px-5 rounded-xl border-2 hover:border-blue-500 hover:bg-blue-50"
              >
                <Calculator className="w-4 h-4" />
                {isCalculating ? "Recalculando..." : "Recalcular"}
              </Button>
              <Button variant="outline" onClick={handleSave} className="gap-2 h-11 px-5 rounded-xl border-2 hover:border-blue-500 hover:bg-blue-50">
                <Save className="w-4 h-4" />
                Salvar
              </Button>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Total do Pedido</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  R$ {total.toFixed(2)}
                </p>
              </div>
              <Button onClick={handleCloseOrder} className="gap-2 h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30 rounded-xl text-base">
                <CheckCircle2 className="w-5 h-5" />
                Fechar Pedido
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}