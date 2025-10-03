import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { DataTable, Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FormTextarea } from "@/components/FormTextarea";
import { CheckCircle, XCircle } from "lucide-react";
import { requestsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function DepartmentRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

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

  const handleAction = async () => {
    if (!selectedRequest || !action) return;

    setSubmitting(true);
    try {
      if (action === "approve") {
        await requestsAPI.approve(selectedRequest.id, comment);
        toast({
          title: "Request approved",
          description: "Payment request has been approved successfully",
        });
      } else {
        await requestsAPI.reject(selectedRequest.id, comment);
        toast({
          title: "Request rejected",
          description: "Payment request has been rejected",
        });
      }
      closeDialog();
      loadRequests();
    } catch (error) {
      toast({
        title: "Action failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const closeDialog = () => {
    setSelectedRequest(null);
    setAction(null);
    setComment("");
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
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          {row.status === "pending" && (
            <>
              <Button
                size="sm"
                variant="default"
                onClick={() => {
                  setSelectedRequest(row);
                  setAction("approve");
                }}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  setSelectedRequest(row);
                  setAction("reject");
                }}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </>
          )}
        </div>
      ),
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
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 gradient-text">Department Requests</h1>
          <p className="text-muted-foreground text-lg">
            Review and manage payment requests from your department
          </p>
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
              searchPlaceholder="Search requests..."
            />
          )}
        </motion.div>
      </div>

      {/* Approve/Reject Dialog */}
      <Dialog open={!!selectedRequest && !!action} onOpenChange={closeDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {action === "approve" ? "Approve Request" : "Reject Request"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Request ID</p>
              <p className="font-semibold text-foreground">#{selectedRequest?.id}</p>
              <p className="text-sm text-muted-foreground mt-2">Amount</p>
              <p className="font-semibold text-primary text-lg">
                ${selectedRequest?.totalAmount?.toLocaleString()} {selectedRequest?.currency}
              </p>
            </div>
            <FormTextarea
              label="Comment (optional)"
              placeholder="Add a note for the requester..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={submitting}>
              Cancel
            </Button>
            <Button
              variant={action === "approve" ? "default" : "destructive"}
              onClick={handleAction}
              disabled={submitting}
            >
              {submitting ? "Processing..." : action === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
