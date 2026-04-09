import { useState, useEffect } from "react";
import { Mail, MessageSquare, Trash2, Save, Calculator, CheckCircle2, Plus } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router";
import { StatusBadge } from "../components/StatusBadge";
import { PriceBadge } from "../components/PriceBadge";
import { DiscountSuggestion } from "../components/DiscountSuggestion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "../components/ui/alert-dialog";
import { useOrders, Order, OrderItem } from "../contexts/OrdersContext";

export function Orcamentos() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { activeOrders, closeOrder, addOrder, deleteOrder, updateOrderStatus, updateOrder } = useOrders();
  
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const selectedOrder = activeOrders.find((o) => o.id === selectedOrderId) || null;
  const [items, setItems] = useState<OrderItem[]>([]);
  const [cliente, setCliente] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [newProductInput, setNewProductInput] = useState("");

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      handleNewOrder();
      // Limpa o parâmetro da URL após processar
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("new");
      setSearchParams(newParams);
    }
  }, [searchParams]);

  // Efeito para mudar o status do pedido selecionado inicialmente se for "novo"
  useEffect(() => {
    if (selectedOrderId && selectedOrder && selectedOrder.status === "novo") {
      updateOrderStatus(selectedOrderId, "em-analise");
    }
  }, [selectedOrderId, selectedOrder?.status, updateOrderStatus]);

  const handleNewOrder = () => {
    setSelectedOrderId(null);
    setItems([]);
    setCliente("");
  };

  const handleAddProduct = () => {
    if (!newProductInput.trim()) return;
    
    const newItem: OrderItem = {
      id: Math.random().toString(36).substr(2, 9),
      produto: newProductInput,
      quantidade: 1,
      precoUnitario: 0,
      precoOriginal: 0,
      tipoPreco: "normal",
      total: 0,
    };
    
    setItems((prev) => [...prev, newItem]);
    setNewProductInput("");
  };

  const handleSelectOrder = (order: Order) => {
    setSelectedOrderId(order.id);
    setItems(order.items);
    setCliente(order.cliente);
    
    // Se o status for novo, muda para em-analise
    if (order.status === "novo") {
      updateOrderStatus(order.id, "em-analise");
    }
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;

        let newPrecoUnitario = item.precoUnitario;
        let newTipoPreco = item.tipoPreco;

        // Lógica de Preço por Lote
        if (item.tipoPreco !== "oferta") {
          if (item.suggestQuantity && item.suggestPrice) {
            if (newQuantity >= item.suggestQuantity) {
              newPrecoUnitario = item.suggestPrice;
              newTipoPreco = "lote";
            } else {
              // Se a quantidade baixou do lote, volta para o original
              newPrecoUnitario = item.precoOriginal;
              newTipoPreco = "normal";
            }
          }
        }

        return { 
          ...item, 
          quantidade: newQuantity, 
          precoUnitario: newPrecoUnitario,
          tipoPreco: newTipoPreco,
          total: newQuantity * newPrecoUnitario 
        };
      })
    );
  };

  const handleRecalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
    }, 800);
  };

  const handleSave = () => {
    if (!cliente) return;
    
    if (selectedOrderId) {
      // Atualiza pedido existente
      const updatedOrder: Order = {
        ...selectedOrder!,
        id: selectedOrderId,
        cliente,
        items,
        data: selectedOrder?.data || new Date().toISOString().split('T')[0],
      };
      updateOrder(updatedOrder);
      console.log("Pedido atualizado:", updatedOrder);
    } else {
      // Cria novo pedido
      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9),
        cliente,
        items,
        data: new Date().toISOString().split('T')[0],
        origem: "whatsapp",
        status: "novo"
      };

      addOrder(newOrder);
      setSelectedOrderId(newOrder.id);
      console.log("Pedido salvo:", newOrder);
    }
  };

  const handleCloseOrder = () => {
    if (selectedOrder) {
      closeOrder(selectedOrder.id);
      navigate("/pedidos-fechados");
    }
  };

  const handleDeleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleRemoveOrder = (orderId: string) => {
    deleteOrder(orderId);
    if (selectedOrderId === orderId) {
      setSelectedOrderId(null);
      setItems([]);
      setCliente("");
    }
  };

  const total = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="flex h-full">
      {/* Lista de Pedidos */}
      <div className="w-96 border-r border-border bg-sidebar overflow-y-auto shadow-sm">
        <div className="p-6 border-b border-border bg-gradient-to-br from-muted/50 to-background flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Orçamentos em Aberto</h2>
            <p className="text-sm text-muted-foreground mt-1">{activeOrders.length} pedidos ativos</p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleNewOrder}
            className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-3 space-y-3">
          {/* Item de Novo Pedido (se estiver criando) */}
          {!selectedOrder && (
            <div className="w-full text-left p-4 rounded-2xl transition-all duration-200 bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-500 shadow-lg shadow-blue-500/10 scale-[1.02]">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 truncate pr-2">Novo Orçamento</h3>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-500 shadow-lg shadow-blue-500/30">
                  <Plus className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Agoras mesmo</span>
                <StatusBadge status="novo" />
              </div>
            </div>
          )}

          {activeOrders.map((order) => (
            <div
              key={order.id}
              className="relative group"
            >
              <button
                onClick={() => handleSelectOrder(order)}
                className={`w-full text-left p-4 rounded-2xl transition-all duration-200 ${
                  selectedOrder?.id === order.id
                    ? "bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-2 border-blue-500 shadow-lg shadow-blue-500/10 scale-[1.02]"
                    : "bg-card hover:bg-muted/50 border-2 border-border hover:border-accent hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-foreground truncate pr-8">{order.cliente}</h3>
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
                  <span className="text-sm text-muted-foreground">
                    {new Date(order.data).toLocaleDateString("pt-BR")}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
              </button>

              <div className="absolute top-4 right-14 opacity-0 group-hover:opacity-100 transition-opacity">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir Orçamento?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o orçamento de "{order.cliente}"? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleRemoveOrder(order.id)}
                        className="bg-red-500 hover:bg-red-600 rounded-xl"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detalhe do Pedido */}
      <div className="flex-1 flex flex-col overflow-hidden bg-background">
        {/* Header do Pedido */}
        <div className="p-8 border-b border-border bg-card shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1 max-2xl">
              {!selectedOrder ? (
                <Input
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  placeholder="Nome do Cliente..."
                  className="text-3xl font-semibold text-foreground h-auto p-0 border-0 focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/30"
                  autoFocus
                />
              ) : (
                <h2 className="text-3xl font-semibold text-foreground">{cliente}</h2>
              )}
              <div className="flex items-center gap-4 mt-3">
                <span className="text-sm text-muted-foreground">
                  {new Date(selectedOrder?.data || new Date()).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <StatusBadge status={selectedOrder?.status || "novo"} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {(selectedOrder?.origem || "whatsapp") === "whatsapp" ? (
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

        {/* Barra de Adição de Produtos */}
        <div className="px-8 pt-6">
          <div className="flex items-center gap-4 bg-card p-4 rounded-2xl shadow-sm border border-border">
            <div className="flex-1 relative">
              <Plus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Inserir código ou nome do produto para adicionar..."
                value={newProductInput}
                onChange={(e) => setNewProductInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddProduct()}
                className="pl-12 h-12 bg-muted/50 border-border focus:bg-card rounded-xl"
              />
            </div>
            <Button 
              onClick={handleAddProduct}
              className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>
        </div>

        {/* Tabela de Itens */}
        <div className="flex-1 overflow-auto p-8">
          <Card className="overflow-hidden shadow-lg border-0 rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-muted/50 to-muted/20 border-b-2 border-border">
                  <tr>
                    <th className="text-left p-5 font-semibold text-sm text-foreground">Produto</th>
                    <th className="text-center p-5 font-semibold text-sm text-foreground w-32">Quantidade</th>
                    <th className="text-right p-5 font-semibold text-sm text-foreground w-32">Preço Unit.</th>
                    <th className="text-center p-5 font-semibold text-sm text-foreground w-32">Tipo</th>
                    <th className="text-right p-5 font-semibold text-sm text-foreground w-32">Total</th>
                    <th className="w-16"></th>
                  </tr>
                </thead>
                <tbody className="bg-card">
                  {items.map((item, index) => (
                    <tr key={item.id} className={`border-b border-border last:border-0 hover:bg-blue-500/5 transition-colors ${index % 2 === 0 ? 'bg-card' : 'bg-muted/10'}`}>
                      <td className="p-5">
                        <div>
                          <p className="font-semibold text-foreground">{item.produto}</p>
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
                          className="text-center bg-card border-border rounded-xl shadow-sm"
                        />
                      </td>
                      <td className="p-5 text-right font-medium text-foreground">
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
                      <td className="p-5 text-right font-bold text-foreground text-lg">
                        R$ {item.total.toFixed(2)}
                      </td>
                      <td className="p-5 text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remover Item?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover "{item.produto}" deste orçamento? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteItem(item.id)}
                                className="bg-red-500 hover:bg-red-600 rounded-xl"
                              >
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-muted/30 border-t border-border flex justify-center">
              <Button
                variant="ghost"
                onClick={() => {
                  const newItem: OrderItem = {
                    id: Math.random().toString(36).substr(2, 9),
                    produto: "Novo Produto",
                    quantidade: 1,
                    precoUnitario: 0,
                    precoOriginal: 0,
                    tipoPreco: "normal",
                    total: 0,
                  };
                  setItems([...items, newItem]);
                }}
                className="gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-500/10 rounded-xl font-semibold"
              >
                <Plus className="w-4 h-4" />
                Adicionar Item ao Pedido
              </Button>
            </div>
          </Card>
        </div>

        {/* Footer com Total e Ações */}
        <div className="border-t border-border bg-card p-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleRecalculate}
                disabled={isCalculating}
                className="gap-2 h-11 px-5 rounded-xl border-2 hover:border-blue-500 hover:bg-blue-500/10"
              >
                <Calculator className="w-4 h-4" />
                {isCalculating ? "Recalculando..." : "Recalcular"}
              </Button>
              <Button variant="outline" onClick={handleSave} className="gap-2 h-11 px-5 rounded-xl border-2 hover:border-blue-500 hover:bg-blue-500/10">
                <Save className="w-4 h-4" />
                Salvar
              </Button>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Total do Pedido</p>
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