import { useState } from "react";
import { MessageSquare, Mail, ArrowRight, FileText, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useNavigate } from "react-router";
import { useOrders } from "../contexts/OrdersContext";


export function Importacao() {
  const navigate = useNavigate();
  const { addOrder, pendingImports, removePendingImport } = useOrders();
  const [processing, setProcessing] = useState<string | null>(null);

  const parseImportItems = (text: string) => {
    const lines = text.split('\n');
    const items: any[] = [];
    
    // Regex para padrões comuns: 
    // 1. "- 10 filtros..." (WhatsApp)
    // 2. "1. Bateria... - Qtd: 20" (Email)
    // 3. "10x Produto" ou "10 unidades de Produto"
    const patterns = [
      /[-*]?\s*(\d+)\s+([^-:]+)/, // Padrão WhatsApp: "- 10 Produto"
      /([^0-9]+)\s*[-:]\s*Qtd:\s*(\d+)/i, // Padrão Email: "Produto - Qtd: 10"
      /(\d+)\s*x\s*(.+)/i, // Padrão: "10x Produto"
    ];

    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      let matchFound = false;
      for (const pattern of patterns) {
        const match = trimmedLine.match(pattern);
        if (match) {
          let quantity, product;
          
          if (pattern.source.includes('Qtd:')) {
            product = match[1].trim().replace(/^\d+\.\s*/, ''); // Remove "1. " do início
            quantity = parseInt(match[2]);
          } else {
            quantity = parseInt(match[1]);
            product = match[2].trim();
          }

          if (quantity && product) {
            // Simulando preços básicos
            const basePrice = product.toLowerCase().includes('filtro') ? 25.90 : 
                             product.toLowerCase().includes('pastilha') ? 89.90 :
                             product.toLowerCase().includes('bateria') ? 450.00 :
                             product.toLowerCase().includes('óleo') ? 55.00 : 120.00;

            items.push({
              id: Math.random().toString(36).substr(2, 9),
              produto: product,
              quantidade: quantity,
              precoUnitario: basePrice,
              precoOriginal: basePrice,
              tipoPreco: "normal",
              total: quantity * basePrice,
              suggestQuantity: quantity > 10 ? Math.ceil(quantity * 1.5) : 20,
              suggestPrice: basePrice * 0.85
            });
            matchFound = true;
            break;
          }
        }
      }
    });

    return items;
  };

  const handleProcess = (importId: string) => {
    const importItem = pendingImports.find(imp => imp.id === importId);
    if (!importItem) return;

    setProcessing(importId);
    
    setTimeout(() => {
      const parsedItems = parseImportItems(importItem.textoOriginal);
      
      // Se não conseguiu parsear nada, usa um fallback ou os itens identificados
      const finalItems = parsedItems.length > 0 ? parsedItems : [
        {
          id: Math.random().toString(36).substr(2, 9),
          produto: importItem.preview.split(',')[0],
          quantidade: 1,
          precoUnitario: 100.00,
          precoOriginal: 100.00,
          tipoPreco: "normal",
          total: 100.00
        }
      ];

      // Adiciona o pedido ao contexto global
      addOrder({
        id: `I${Math.floor(1000 + Math.random() * 9000)}`,
        cliente: importItem.cliente,
        origem: importItem.origem,
        data: new Date().toISOString().split('T')[0],
        status: "novo",
        items: finalItems
      });

      removePendingImport(importId);
      setProcessing(null);
      
      // Redireciona para o início (Orçamentos)
      navigate("/");
    }, 1200);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins} min atrás`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h atrás`;
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Importação de Pedidos</h1>
        <p className="text-gray-500 mt-2 text-lg">
          Pedidos recebidos via WhatsApp e Email aguardando processamento
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 border-0 shadow-lg hover:shadow-xl transition-shadow rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Aguardando Processamento</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{pendingImports.length}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <FileText className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-green-100/50 border-0 shadow-lg hover:shadow-xl transition-shadow rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-medium">Processados Hoje</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <ArrowRight className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Lista de Importações */}
      <div className="space-y-5">
        {pendingImports.map((importItem) => (
          <Card key={importItem.id} className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl">
            <div className="space-y-4">
              {/* Header do Card */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                      importItem.origem === "whatsapp"
                        ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/30"
                        : "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30"
                    }`}
                  >
                    {importItem.origem === "whatsapp" ? (
                      <MessageSquare className="w-6 h-6 text-white" />
                    ) : (
                      <Mail className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{importItem.cliente}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge
                        variant="secondary"
                        className={
                          importItem.origem === "whatsapp"
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-sm"
                            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-sm"
                        }
                      >
                        {importItem.origem === "whatsapp" ? "WhatsApp" : "Email"}
                      </Badge>
                      <span className="text-sm text-gray-500 font-medium">
                        {getTimeAgo(importItem.data)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleProcess(importItem.id)}
                  disabled={processing === importItem.id}
                  className="gap-2 h-11 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30 rounded-xl"
                >
                  {processing === importItem.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      Processar Pedido
                    </>
                  )}
                </Button>
              </div>

              {/* Preview */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-5 border-2 border-gray-100">
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Preview do pedido:
                </p>
                <p className="text-sm text-gray-700">{importItem.preview}</p>
              </div>

              {/* Texto Original */}
              <details className="group">
                <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
                  <span>Ver texto original completo</span>
                  <ArrowRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-4 p-5 bg-white rounded-xl border-2 border-gray-200">
                  <pre className="text-sm whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                    {importItem.textoOriginal}
                  </pre>
                </div>
              </details>
            </div>
          </Card>
        ))}

        {pendingImports.length === 0 && (
          <Card className="p-16 border-0 shadow-lg rounded-2xl">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mx-auto mb-6 flex items-center justify-center">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Nenhum pedido aguardando processamento
              </h3>
              <p className="text-gray-500 text-lg">
                Novos pedidos recebidos via WhatsApp ou Email aparecerão aqui
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}