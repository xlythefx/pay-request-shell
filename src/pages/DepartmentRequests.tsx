import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { DataTable, Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FormTextarea } from "@/components/FormTextarea";
import { CheckCircle, XCircle, FileText } from "lucide-react";
import { requestsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { getAuth } from "@/lib/auth";
import { generateDepartmentReportPDF } from "@/lib/pdfGenerator";

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
      // Mock data for UI demonstration
      const mockRequests = [
        {
          id: "REQ-001",
          type: "vendor_payment",
          vendorName: "ABC Supplies Inc.",
          totalAmount: 15000,
          currency: "USD",
          status: "pending",
          createdAt: new Date("2025-09-28").toISOString(),
          department: "Marketing",
        },
        {
          id: "REQ-002",
          type: "employee_reimbursement",
          employeeName: "Sarah Johnson",
          totalAmount: 450,
          currency: "USD",
          status: "pending",
          createdAt: new Date("2025-09-29").toISOString(),
          department: "Marketing",
        },
        {
          id: "REQ-003",
          type: "digital_tool_subscription",
          toolName: "Adobe Creative Cloud",
          totalAmount: 2400,
          currency: "USD",
          status: "approved",
          createdAt: new Date("2025-09-27").toISOString(),
          department: "Marketing",
        },
        {
          id: "REQ-004",
          type: "vendor_payment",
          vendorName: "Tech Solutions Ltd.",
          totalAmount: 8500,
          currency: "USD",
          status: "pending",
          createdAt: new Date("2025-09-30").toISOString(),
          department: "IT",
        },
      ];

      const { user } = getAuth();
      const departmentRequests = user?.department 
        ? mockRequests.filter((req: any) => req.department === user.department)
        : mockRequests;
      
      setRequests(departmentRequests);
    } catch (error) {
      console.error("Failed to load requests", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    const { user } = getAuth();
    if (!user) return;

    generateDepartmentReportPDF({
      department: user.department || "Unknown Department",
      generatedBy: user.name,
      generatedAt: new Date().toISOString(),
      companyName: "Digital Payment System",
      requests: requests.map(req => ({
        id: req.id,
        type: req.type,
        vendorName: req.vendorName,
        employeeName: req.employeeName,
        toolName: req.toolName,
        totalAmount: req.totalAmount,
        currency: req.currency,
        status: req.status,
        createdAt: req.createdAt
      }))
    });

    toast({
      title: "Report generated",
      description: "Financial report has been downloaded successfully",
    });
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
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2 gradient-text">Department Requests</h1>
              <p className="text-muted-foreground text-lg">
                Review and manage payment requests from your department
              </p>
            </div>
            <Button onClick={handleGenerateReport} disabled={loading || requests.length === 0}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
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
