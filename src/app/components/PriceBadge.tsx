import { Badge } from "./ui/badge";

type PriceType = "normal" | "oferta" | "lote";

interface PriceBadgeProps {
  type: PriceType;
}

const priceTypeConfig = {
  normal: {
    label: "Normal",
    className: "bg-gradient-to-r from-slate-400 to-slate-500 text-white border-0 shadow-sm",
  },
  oferta: {
    label: "Oferta",
    className: "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-sm animate-pulse",
  },
  lote: {
    label: "Lote",
    className: "bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 shadow-sm",
  },
};

export function PriceBadge({ type }: PriceBadgeProps) {
  const config = priceTypeConfig[type];

  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  );
}