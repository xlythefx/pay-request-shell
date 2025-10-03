import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: "approved" | "pending" | "rejected";
  className?: string;
}

const statusConfig = {
  approved: {
    label: "Approved",
    icon: CheckCircle,
    className: "status-approved",
  },
  pending: {
    label: "On Hold",
    icon: Clock,
    className: "status-pending",
  },
  rejected: {
    label: "Not Approved",
    icon: XCircle,
    className: "status-rejected",
  },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={cn("flex items-center gap-1 px-3 py-1", config.className, className)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};
