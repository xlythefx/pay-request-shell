import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/FormInput";
import { FormTextarea } from "@/components/FormTextarea";
import { FormSelect } from "@/components/FormSelect";
import { FileUploader } from "@/components/FileUploader";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { requestsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type TemplateType = "link_building" | "salary" | "tools" | "other_work";

const currencyOptions = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
];

export default function CreateRequest() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [template, setTemplate] = useState<TemplateType | null>(null);
  const [loading, setLoading] = useState(false);

  // Link Building & Content Template
  const [linkBuildingData, setLinkBuildingData] = useState({
    vendorName: "",
    invoiceNumber: "",
    invoiceDate: "",
    currency: "USD",
    items: [{ client: "", description: "", amount: "" }],
    note: "",
    file: null as File | null,
  });

  // Salary Template
  const [salaryData, setSalaryData] = useState({
    employeeName: "",
    employeeAddress: "",
    position: "",
    invoiceNumber: "",
    date: "",
    currency: "USD",
    items: [{ description: "", amount: "" }],
    paymentMethod: "",
    file: null as File | null,
  });

  // Tools Template
  const [toolsData, setToolsData] = useState({
    toolName: "",
    toolCategory: "",
    paymentFrequency: "",
    description: "",
    amount: "",
    currency: "USD",
    note: "",
    file: null as File | null,
  });

  // Other Work Template
  const [otherWorkData, setOtherWorkData] = useState({
    vendorName: "",
    invoiceNumber: "",
    invoiceDate: "",
    workCategory: "",
    clientOrProject: "",
    description: "",
    amount: "",
    currency: "USD",
    note: "",
    file: null as File | null,
  });

  const templates = [
    {
      type: "link_building" as TemplateType,
      title: "Link Building & Content",
      description: "For SEO, content creation, and link building services",
      bgColor: "bg-success/10",
      borderColor: "border-success/30",
    },
    {
      type: "salary" as TemplateType,
      title: "Salary Payment",
      description: "Monthly salary and compensation requests",
      bgColor: "bg-warning/10",
      borderColor: "border-warning/30",
    },
    {
      type: "tools" as TemplateType,
      title: "Tools & Software",
      description: "Software subscriptions and tool purchases",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/30",
    },
    {
      type: "other_work" as TemplateType,
      title: "Other Work",
      description: "General work and service payments",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30",
    },
  ];

  const addLineItem = (templateType: TemplateType) => {
    if (templateType === "link_building") {
      setLinkBuildingData({
        ...linkBuildingData,
        items: [...linkBuildingData.items, { client: "", description: "", amount: "" }],
      });
    } else if (templateType === "salary") {
      setSalaryData({
        ...salaryData,
        items: [...salaryData.items, { description: "", amount: "" }],
      });
    }
  };

  const removeLineItem = (templateType: TemplateType, index: number) => {
    if (templateType === "link_building") {
      setLinkBuildingData({
        ...linkBuildingData,
        items: linkBuildingData.items.filter((_, i) => i !== index),
      });
    } else if (templateType === "salary") {
      setSalaryData({
        ...salaryData,
        items: salaryData.items.filter((_, i) => i !== index),
      });
    }
  };

  const calculateTotal = () => {
    if (template === "link_building") {
      return linkBuildingData.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    } else if (template === "salary") {
      return salaryData.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    } else if (template === "tools") {
      return parseFloat(toolsData.amount) || 0;
    } else if (template === "other_work") {
      return parseFloat(otherWorkData.amount) || 0;
    }
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let requestData: any = {
        type: template,
        totalAmount: calculateTotal(),
      };

      if (template === "link_building") {
        requestData = { ...requestData, ...linkBuildingData };
      } else if (template === "salary") {
        requestData = { ...requestData, ...salaryData };
      } else if (template === "tools") {
        requestData = { ...requestData, ...toolsData };
      } else if (template === "other_work") {
        requestData = { ...requestData, ...otherWorkData };
      }

      await requestsAPI.create(requestData);
      
      toast({
        title: "Request submitted successfully",
        description: "Your payment request has been sent for approval",
      });
      
      navigate("/requests");
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!template) {
    return (
      <div className="min-h-screen">
        <BackgroundAnimation />
        <Navbar />
        
        <div className="container mx-auto px-4 pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <h1 className="text-4xl font-bold mb-2 gradient-text">Create Payment Request</h1>
            <p className="text-muted-foreground text-lg mb-8">Choose a template to get started</p>

            <div className="grid md:grid-cols-2 gap-6">
              {templates.map((temp, index) => (
                <motion.div
                  key={temp.type}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`glass-effect cursor-pointer hover:scale-105 transition-all duration-300 ${temp.bgColor} border-2 ${temp.borderColor}`}
                    onClick={() => setTemplate(temp.type)}
                  >
                    <CardHeader>
                      <CardTitle className="text-foreground">{temp.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{temp.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <BackgroundAnimation />
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => setTemplate(null)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Change Template
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-effect">
            <CardHeader className={templates.find(t => t.type === template)?.bgColor}>
              <CardTitle className="text-2xl text-foreground">
                {templates.find(t => t.type === template)?.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Link Building Template */}
                {template === "link_building" && (
                  <>
                    <div className="grid md:grid-cols-3 gap-4">
                      <FormInput
                        label="Vendor Name"
                        required
                        value={linkBuildingData.vendorName}
                        onChange={(e) => setLinkBuildingData({...linkBuildingData, vendorName: e.target.value})}
                      />
                      <FormInput
                        label="Invoice Number"
                        required
                        value={linkBuildingData.invoiceNumber}
                        onChange={(e) => setLinkBuildingData({...linkBuildingData, invoiceNumber: e.target.value})}
                      />
                      <FormInput
                        label="Invoice Date"
                        type="date"
                        required
                        value={linkBuildingData.invoiceDate}
                        onChange={(e) => setLinkBuildingData({...linkBuildingData, invoiceDate: e.target.value})}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">Line Items</h3>
                        <Button type="button" variant="outline" size="sm" onClick={() => addLineItem("link_building")}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Item
                        </Button>
                      </div>
                      {linkBuildingData.items.map((item, index) => (
                        <div key={index} className="grid md:grid-cols-[1fr,2fr,1fr,auto] gap-4 p-4 bg-secondary/50 rounded-lg">
                          <FormInput
                            placeholder="Client/Project"
                            value={item.client}
                            onChange={(e) => {
                              const newItems = [...linkBuildingData.items];
                              newItems[index].client = e.target.value;
                              setLinkBuildingData({...linkBuildingData, items: newItems});
                            }}
                          />
                          <FormInput
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => {
                              const newItems = [...linkBuildingData.items];
                              newItems[index].description = e.target.value;
                              setLinkBuildingData({...linkBuildingData, items: newItems});
                            }}
                          />
                          <FormInput
                            type="number"
                            placeholder="Amount"
                            value={item.amount}
                            onChange={(e) => {
                              const newItems = [...linkBuildingData.items];
                              newItems[index].amount = e.target.value;
                              setLinkBuildingData({...linkBuildingData, items: newItems});
                            }}
                          />
                          {linkBuildingData.items.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeLineItem("link_building", index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    <FormSelect
                      label="Currency"
                      options={currencyOptions}
                      value={linkBuildingData.currency}
                      onValueChange={(value) => setLinkBuildingData({...linkBuildingData, currency: value})}
                    />

                    <FormTextarea
                      label="Notes & Payment Method"
                      value={linkBuildingData.note}
                      onChange={(e) => setLinkBuildingData({...linkBuildingData, note: e.target.value})}
                    />

                    <FileUploader
                      label="Upload Invoice"
                      required
                      onFileChange={(file) => setLinkBuildingData({...linkBuildingData, file})}
                    />
                  </>
                )}

                {/* Salary Template */}
                {template === "salary" && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormInput
                        label="Employee Name & Address"
                        required
                        value={salaryData.employeeName}
                        onChange={(e) => setSalaryData({...salaryData, employeeName: e.target.value})}
                      />
                      <FormInput
                        label="Invoice Number"
                        required
                        value={salaryData.invoiceNumber}
                        onChange={(e) => setSalaryData({...salaryData, invoiceNumber: e.target.value})}
                      />
                    </div>

                    <FormInput
                      label="Employee Position"
                      required
                      value={salaryData.position}
                      onChange={(e) => setSalaryData({...salaryData, position: e.target.value})}
                    />

                    <FormInput
                      label="Date"
                      type="date"
                      required
                      value={salaryData.date}
                      onChange={(e) => setSalaryData({...salaryData, date: e.target.value})}
                    />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">Salary Items</h3>
                        <Button type="button" variant="outline" size="sm" onClick={() => addLineItem("salary")}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Item
                        </Button>
                      </div>
                      {salaryData.items.map((item, index) => (
                        <div key={index} className="grid md:grid-cols-[2fr,1fr,auto] gap-4 p-4 bg-secondary/50 rounded-lg">
                          <FormInput
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => {
                              const newItems = [...salaryData.items];
                              newItems[index].description = e.target.value;
                              setSalaryData({...salaryData, items: newItems});
                            }}
                          />
                          <FormInput
                            type="number"
                            placeholder="Amount"
                            value={item.amount}
                            onChange={(e) => {
                              const newItems = [...salaryData.items];
                              newItems[index].amount = e.target.value;
                              setSalaryData({...salaryData, items: newItems});
                            }}
                          />
                          {salaryData.items.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeLineItem("salary", index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    <FormSelect
                      label="Currency"
                      options={currencyOptions}
                      value={salaryData.currency}
                      onValueChange={(value) => setSalaryData({...salaryData, currency: value})}
                    />

                    <FormTextarea
                      label="Payment Method / Bank Details"
                      required
                      value={salaryData.paymentMethod}
                      onChange={(e) => setSalaryData({...salaryData, paymentMethod: e.target.value})}
                    />

                    <FileUploader
                      label="Upload Payroll Document"
                      onFileChange={(file) => setSalaryData({...salaryData, file})}
                    />
                  </>
                )}

                {/* Tools Template */}
                {template === "tools" && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormInput
                        label="Tool Name"
                        required
                        value={toolsData.toolName}
                        onChange={(e) => setToolsData({...toolsData, toolName: e.target.value})}
                      />
                      <FormInput
                        label="Tool Category"
                        required
                        value={toolsData.toolCategory}
                        onChange={(e) => setToolsData({...toolsData, toolCategory: e.target.value})}
                      />
                    </div>

                    <FormSelect
                      label="Payment Frequency"
                      required
                      options={[
                        { value: "monthly", label: "Monthly" },
                        { value: "annually", label: "Annually" },
                        { value: "one-time", label: "One-Time Payment" },
                      ]}
                      value={toolsData.paymentFrequency}
                      onValueChange={(value) => setToolsData({...toolsData, paymentFrequency: value})}
                    />

                    <FormTextarea
                      label="Description"
                      required
                      value={toolsData.description}
                      onChange={(e) => setToolsData({...toolsData, description: e.target.value})}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormInput
                        label="Amount"
                        type="number"
                        required
                        value={toolsData.amount}
                        onChange={(e) => setToolsData({...toolsData, amount: e.target.value})}
                      />
                      <FormSelect
                        label="Currency"
                        options={currencyOptions}
                        value={toolsData.currency}
                        onValueChange={(value) => setToolsData({...toolsData, currency: value})}
                      />
                    </div>

                    <FormTextarea
                      label="Notes & Payment Method"
                      value={toolsData.note}
                      onChange={(e) => setToolsData({...toolsData, note: e.target.value})}
                    />

                    <FileUploader
                      label="Upload Invoice"
                      onFileChange={(file) => setToolsData({...toolsData, file})}
                    />
                  </>
                )}

                {/* Other Work Template */}
                {template === "other_work" && (
                  <>
                    <div className="grid md:grid-cols-3 gap-4">
                      <FormInput
                        label="Vendor Name"
                        required
                        value={otherWorkData.vendorName}
                        onChange={(e) => setOtherWorkData({...otherWorkData, vendorName: e.target.value})}
                      />
                      <FormInput
                        label="Invoice Number"
                        required
                        value={otherWorkData.invoiceNumber}
                        onChange={(e) => setOtherWorkData({...otherWorkData, invoiceNumber: e.target.value})}
                      />
                      <FormInput
                        label="Invoice Date"
                        type="date"
                        required
                        value={otherWorkData.invoiceDate}
                        onChange={(e) => setOtherWorkData({...otherWorkData, invoiceDate: e.target.value})}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormInput
                        label="Work Category"
                        required
                        value={otherWorkData.workCategory}
                        onChange={(e) => setOtherWorkData({...otherWorkData, workCategory: e.target.value})}
                      />
                      <FormInput
                        label="Client/Project Name"
                        required
                        value={otherWorkData.clientOrProject}
                        onChange={(e) => setOtherWorkData({...otherWorkData, clientOrProject: e.target.value})}
                      />
                    </div>

                    <FormTextarea
                      label="Description"
                      required
                      value={otherWorkData.description}
                      onChange={(e) => setOtherWorkData({...otherWorkData, description: e.target.value})}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormInput
                        label="Amount"
                        type="number"
                        required
                        value={otherWorkData.amount}
                        onChange={(e) => setOtherWorkData({...otherWorkData, amount: e.target.value})}
                      />
                      <FormSelect
                        label="Currency"
                        options={currencyOptions}
                        value={otherWorkData.currency}
                        onValueChange={(value) => setOtherWorkData({...otherWorkData, currency: value})}
                      />
                    </div>

                    <FormTextarea
                      label="Notes & Payment Method"
                      value={otherWorkData.note}
                      onChange={(e) => setOtherWorkData({...otherWorkData, note: e.target.value})}
                    />

                    <FileUploader
                      label="Upload Invoice"
                      required
                      onFileChange={(file) => setOtherWorkData({...otherWorkData, file})}
                    />
                  </>
                )}

                {/* Total Amount Display */}
                <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary/30">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-foreground">Total Amount:</span>
                    <span className="text-2xl font-bold gradient-text">
                      {calculateTotal().toLocaleString()} {
                        template === "link_building" ? linkBuildingData.currency :
                        template === "salary" ? salaryData.currency :
                        template === "tools" ? toolsData.currency :
                        otherWorkData.currency
                      }
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setTemplate(null)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

