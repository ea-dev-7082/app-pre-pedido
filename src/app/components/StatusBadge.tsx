import { Badge } from "./ui/badge";

type Status = "novo" | "em-analise" | "exportado" | "pendente";

interface StatusBadgeProps {
  status: Status;
}

const statusConfig = {
  novo: {
    label: "Novo",
    className: "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-sm",
  },
  "em-analise": {
    label: "Em análise",
    className: "bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-sm",
  },
  exportado: {
    label: "Exportado",
    className: "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-sm",
  },
  pendente: {
    label: "Pendente",
    className: "bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 shadow-sm",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  );
}