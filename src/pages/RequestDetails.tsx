import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { requestsAPI } from "@/lib/api";

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequest();
  }, [id]);

  const loadRequest = async () => {
    try {
      const data = await requestsAPI.getById(Number(id));
      setRequest(data);
    } catch (error) {
      console.error("Failed to load request", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Request not found</p>
      </div>
    );
  }

  const getStatusColor = () => {
    switch (request.status) {
      case "approved":
        return "bg-success/10 border-success/30";
      case "pending":
        return "bg-warning/10 border-warning/30";
      case "rejected":
        return "bg-error/10 border-error/30";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen">
      <BackgroundAnimation />
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/requests")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Requests
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className={`glass-effect border-2 ${getStatusColor()}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl text-foreground mb-2">
                    Payment Request #{request.id}
                  </CardTitle>
                  <p className="text-muted-foreground capitalize">
                    {request.type.replace("_", " ")} Payment
                  </p>
                </div>
                <StatusBadge status={request.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-muted-foreground">Vendor/Employee</label>
                  <p className="text-lg font-medium text-foreground">
                    {request.vendorName || request.employeeName || request.toolName || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Invoice Number</label>
                  <p className="text-lg font-medium text-foreground">
                    {request.invoiceNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Date</label>
                  <p className="text-lg font-medium text-foreground">
                    {request.invoiceDate || request.date || new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Total Amount</label>
                  <p className="text-2xl font-bold gradient-text">
                    ${request.totalAmount?.toLocaleString()} {request.currency}
                  </p>
                </div>
              </div>

              {/* Line Items */}
              {request.items && request.items.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Line Items</h3>
                  <div className="space-y-2">
                    {request.items.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                      >
                        <div>
                          {item.client && (
                            <p className="text-sm text-muted-foreground">{item.client}</p>
                          )}
                          <p className="text-foreground">{item.description}</p>
                        </div>
                        <span className="font-semibold text-primary">${item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Details */}
              {(request.description || request.note) && (
                <div>
                  <label className="text-sm text-muted-foreground">Description / Notes</label>
                  <p className="mt-2 text-foreground whitespace-pre-wrap">
                    {request.description || request.note}
                  </p>
                </div>
              )}

              {/* Payment Method */}
              {request.paymentMethod && (
                <div>
                  <label className="text-sm text-muted-foreground">Payment Method</label>
                  <p className="mt-2 text-foreground whitespace-pre-wrap">
                    {request.paymentMethod}
                  </p>
                </div>
              )}

              {/* Manager Note */}
              {request.managerNote && (
                <div className="p-4 bg-secondary/50 rounded-lg border border-border">
                  <label className="text-sm text-muted-foreground">Manager Note</label>
                  <p className="mt-2 text-foreground">{request.managerNote}</p>
                </div>
              )}

              {/* Attached Documents */}
              {request.file && (
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Attached Documents</label>
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    View Invoice
                    <Download className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-4 border-t border-border">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-muted-foreground">Created</label>
                    <p className="text-foreground">{new Date(request.createdAt).toLocaleString()}</p>
                  </div>
                  {request.updatedAt && (
                    <div>
                      <label className="text-muted-foreground">Last Updated</label>
                      <p className="text-foreground">{new Date(request.updatedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
