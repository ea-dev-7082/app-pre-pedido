import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PriceType = "normal" | "oferta" | "lote";
export type OrderStatus = "novo" | "em-analise";
export type ExportStatus = "exportado" | "pendente";

export interface OrderItem {
  id: string;
  produto: string;
  quantidade: number;
  precoUnitario: number;
  precoOriginal: number;
  tipoPreco: PriceType;
  total: number;
  suggestQuantity?: number;
  suggestPrice?: number;
}

export interface Order {
  id: string;
  cliente: string;
  origem: "whatsapp" | "email";
  data: string;
  status: OrderStatus;
  items: OrderItem[];
}

export interface PendingImport {
  id: string;
  cliente: string;
  origem: "whatsapp" | "email";
  data: string;
  textoOriginal: string;
  preview: string;
}

export interface ClosedOrder {
  id: string;
  cliente: string;
  data: string;
  valorTotal: number;
  status: ExportStatus;
  itensCount: number;
  items: OrderItem[];
}

interface OrdersContextType {
  activeOrders: Order[];
  closedOrders: ClosedOrder[];
  pendingImports: PendingImport[];
  addOrder: (order: Order) => void;
  closeOrder: (orderId: string) => void;
  deleteOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrder: (order: Order) => void;
  updateClosedOrderStatus: (orderId: string, status: ExportStatus) => void;
  removePendingImport: (importId: string) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

const initialActiveOrders: Order[] = [
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
        precoOriginal: 25.90,
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
        precoOriginal: 89.90,
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
        precoOriginal: 55.00,
        tipoPreco: "lote",
        total: 2250.00,
        suggestQuantity: 50,
        suggestPrice: 45.00,
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
        precoOriginal: 450.00,
        tipoPreco: "normal",
        total: 3600.00,
        suggestQuantity: 12,
        suggestPrice: 420.00,
      },
    ],
  },
];

const initialClosedOrders: ClosedOrder[] = [
  {
    id: "C001",
    cliente: "Auto Center Silva",
    data: "2026-03-20",
    valorTotal: 15890.50,
    status: "exportado",
    itensCount: 12,
    items: [
      {
        id: "m1",
        produto: "Filtro de Óleo Mann W67/2",
        quantidade: 20,
        precoUnitario: 22.50,
        precoOriginal: 25.90,
        tipoPreco: "lote",
        total: 450.00,
      },
      {
        id: "m2",
        produto: "Pastilha de Freio Cobreq",
        quantidade: 15,
        precoUnitario: 89.90,
        precoOriginal: 89.90,
        tipoPreco: "oferta",
        total: 1348.50,
      }
    ]
  },
  {
    id: "C002",
    cliente: "Oficina Mecânica Santos",
    data: "2026-03-19",
    valorTotal: 8450.00,
    status: "pendente",
    itensCount: 8,
    items: [
      {
        id: "m3",
        produto: "Óleo Motor 5W30 Mobil",
        quantidade: 50,
        precoUnitario: 45.00,
        precoOriginal: 55.00,
        tipoPreco: "lote",
        total: 2250.00,
        suggestQuantity: 50,
        suggestPrice: 45.00,
      }
    ]
  },
];

const mockPendingImports: PendingImport[] = [
  {
    id: "I001",
    cliente: "Oficina Rodrigues",
    origem: "whatsapp",
    data: "2026-03-24T10:30:00",
    textoOriginal: `Bom dia! Preciso de um orçamento:
    
- 10 filtros de óleo Mann W67/2
- 15 pastilhas de freio Cobreq
- 5 kits de embreagem Sachs
- 8 jogos de velas NGK

Aguardo retorno. Obrigado!`,
    preview: "10 filtros de óleo Mann W67/2, 15 pastilhas de freio...",
  },
  {
    id: "I002",
    cliente: "Auto Peças Millennium",
    origem: "email",
    data: "2026-03-24T09:15:00",
    textoOriginal: `Prezados,

Solicito cotação para os seguintes itens:

1. Bateria Moura 60Ah - Qtd: 20 unidades
2. Óleo Motor 5W30 Mobil - Qtd: 100 litros
3. Filtro de ar condicionado - Qtd: 30 unidades

Favor enviar orçamento até o final do dia.

Atenciosamente,
João Silva`,
    preview: "Bateria Moura 60Ah - Qtd: 20 unidades, Óleo Motor 5W30...",
  },
  {
    id: "I003",
    cliente: "Mecânica do Bairro",
    origem: "whatsapp",
    data: "2026-03-24T08:45:00",
    textoOriginal: `Oi! Preciso urgente:
    
- Amortecedor dianteiro Fox (par)
- Disco de freio ventilado
- Correia dentada com tensor

Pode me passar o preço?`,
    preview: "Amortecedor dianteiro Fox (par), Disco de freio...",
  },
];

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [activeOrders, setActiveOrders] = useState<Order[]>(initialActiveOrders);
  const [closedOrders, setClosedOrders] = useState<ClosedOrder[]>(initialClosedOrders);
  const [pendingImports, setPendingImports] = useState<PendingImport[]>(mockPendingImports);

  const addOrder = (order: Order) => {
    setActiveOrders((prev) => [order, ...prev]);
  };

  const closeOrder = (orderId: string) => {
    const orderToClose = activeOrders.find((o) => o.id === orderId);
    if (!orderToClose) return;

    const totalValue = orderToClose.items.reduce((sum, item) => sum + item.total, 0);
    
    const newClosedOrder: ClosedOrder = {
      id: `C${Math.floor(1000 + Math.random() * 9000)}`, // Simula ID do sistema
      cliente: orderToClose.cliente,
      data: new Date().toISOString().split('T')[0],
      valorTotal: totalValue,
      status: "pendente",
      itensCount: orderToClose.items.length,
      items: orderToClose.items,
    };

    setActiveOrders((prev) => prev.filter((o) => o.id !== orderId));
    setClosedOrders((prev) => [newClosedOrder, ...prev]);
  };

  const deleteOrder = (orderId: string) => {
    setActiveOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setActiveOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const updateOrder = (updatedOrder: Order) => {
    setActiveOrders((prev) =>
      prev.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
  };

  const updateClosedOrderStatus = (orderId: string, status: ExportStatus) => {
    setClosedOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const removePendingImport = (importId: string) => {
    setPendingImports((prev) => prev.filter((imp) => imp.id !== importId));
  };

  return (
    <OrdersContext.Provider value={{ 
      activeOrders, 
      closedOrders, 
      pendingImports,
      addOrder, 
      closeOrder, 
      deleteOrder, 
      updateOrderStatus, 
      updateOrder,
      updateClosedOrderStatus,
      removePendingImport
    }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}
