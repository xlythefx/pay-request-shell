import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { DataTable, Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { requestsAPI } from "@/lib/api";

export default function Requests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await requestsAPI.getAll();
      setRequests(response.data || []);
    } catch (error) {
      console.error("Failed to load requests", error);
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<any>[] = [
    {
      key: "id",
      label: "ID",
      sortable: true,
    },
    {
      key: "type",
      label: "Type",
      render: (value) => (
        <span className="capitalize">{value.replace("_", " ")}</span>
      ),
      sortable: true,
    },
    {
      key: "vendorName",
      label: "Vendor/Employee",
      render: (value, row) => value || row.employeeName || row.toolName || "N/A",
      sortable: true,
    },
    {
      key: "invoiceNumber",
      label: "Invoice #",
      sortable: true,
    },
    {
      key: "totalAmount",
      label: "Amount",
      render: (value, row) => (
        <span className="font-semibold text-primary">
          ${value?.toLocaleString()} {row.currency}
        </span>
      ),
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge status={value} />,
      sortable: true,
    },
    {
      key: "createdAt",
      label: "Date",
      render: (value) => new Date(value).toLocaleDateString(),
      sortable: true,
    },
  ];

  return (
    <div className="min-h-screen">
      <BackgroundAnimation />
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2 gradient-text">My Requests</h1>
            <p className="text-muted-foreground text-lg">
              View and manage your payment requests
            </p>
          </div>
          <Button onClick={() => navigate("/requests/create")}>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <DataTable
              data={requests}
              columns={columns}
              onRowClick={(row) => navigate(`/requests/${row.id}`)}
              searchPlaceholder="Search requests..."
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
