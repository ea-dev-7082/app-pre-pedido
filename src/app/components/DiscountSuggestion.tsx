import { TrendingDown } from "lucide-react";

interface DiscountSuggestionProps {
  quantity: number;
  targetQuantity: number;
  targetPrice: number;
}

export function DiscountSuggestion({
  quantity,
  targetQuantity,
  targetPrice,
}: DiscountSuggestionProps) {
  const remaining = targetQuantity - quantity;

  if (remaining <= 0) return null;

  return (
    <div className="flex items-center gap-2.5 text-sm text-emerald-700 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-2.5 rounded-xl border border-emerald-200 shadow-sm">
      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
        <TrendingDown className="w-4 h-4 text-emerald-600" />
      </div>
      <span>
        Compre mais <strong className="font-semibold">{remaining}</strong> {remaining === 1 ? "unidade" : "unidades"} para pagar{" "}
        <strong className="font-semibold">R$ {targetPrice.toFixed(2)}</strong> cada
      </span>
    </div>
  );
}