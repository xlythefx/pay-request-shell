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
import { Plus, Trash2, ArrowLeft, FileDown } from "lucide-react";
import { requestsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { generateLinkBuildingPDF, generateSalaryPDF, generateToolsPDF, generateOtherWorkPDF } from "@/lib/pdfGenerator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type TemplateType = "link_building" | "salary" | "tools" | "other_work";

const currencyOptions = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
];

const clientProjectTypeOptions = [
  { value: "client", label: "Client" },
  { value: "project", label: "Project" },
  { value: "other", label: "Other" },
];

const mockClients = [
  { value: "client1", label: "Acme Corporation" },
  { value: "client2", label: "TechStart Inc" },
  { value: "client3", label: "Global Solutions Ltd" },
  { value: "client4", label: "Digital Innovations" },
];

const mockProjects = [
  { value: "project1", label: "Website Redesign 2024" },
  { value: "project2", label: "Mobile App Development" },
  { value: "project3", label: "SEO Campaign Q1" },
  { value: "project4", label: "Brand Identity Refresh" },
];

const mockEmployees = [
  { value: "emp1", label: "John Smith", address: "123 Main Street, New York, NY 10001", position: "Senior Developer" },
  { value: "emp2", label: "Sarah Johnson", address: "456 Oak Avenue, Los Angeles, CA 90012", position: "Marketing Manager" },
  { value: "emp3", label: "Michael Chen", address: "789 Elm Street, Chicago, IL 60601", position: "UI/UX Designer" },
  { value: "emp4", label: "Emily Davis", address: "321 Pine Road, Houston, TX 77002", position: "Content Writer" },
  { value: "emp5", label: "David Wilson", address: "654 Maple Drive, Miami, FL 33101", position: "SEO Specialist" },
];

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export default function CreateRequest() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [template, setTemplate] = useState<TemplateType | null>(null);
  const [loading, setLoading] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Template notes (for displaying on the right side of template titles)
  const [templateNote, setTemplateNote] = useState("");

  // Link Building & Content Template
  const [linkBuildingData, setLinkBuildingData] = useState({
    vendorName: "",
    invoiceNumber: "",
    invoiceDate: getTodayDate(),
    currency: "USD",
    items: [{ 
      clientProjectType: "" as string,
      selectedClientProject: "" as string, 
      customValue: "" as string,
      description: "", 
      amount: "" 
    }],
    note: "",
    file: null as File | null,
  });

  // Salary Template
  const [salaryData, setSalaryData] = useState({
    employeeName: "",
    employeeAddress: "",
    position: "",
    invoiceNumber: "",
    date: getTodayDate(),
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
    currency: "USD",
    items: [{ 
      description: "", 
      amount: "" 
    }],
    note: "",
    file: null as File | null,
  });

  // Other Work Template
  const [otherWorkData, setOtherWorkData] = useState({
    vendorName: "",
    invoiceNumber: "",
    invoiceDate: getTodayDate(),
    workCategory: "",
    clientProjectType: "" as string,
    selectedClientProject: "" as string,
    customValue: "" as string,
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
        items: [...linkBuildingData.items, { 
          clientProjectType: "", 
          selectedClientProject: "", 
          customValue: "",
          description: "", 
          amount: "" 
        }],
      });
    } else if (templateType === "salary") {
      setSalaryData({
        ...salaryData,
        items: [...salaryData.items, { description: "", amount: "" }],
      });
    } else if (templateType === "tools") {
      setToolsData({
        ...toolsData,
        items: [...toolsData.items, { 
          description: "", 
          amount: "" 
        }],
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
    } else if (templateType === "tools") {
      setToolsData({
        ...toolsData,
        items: toolsData.items.filter((_, i) => i !== index),
      });
    }
  };

  const calculateTotal = () => {
    if (template === "link_building") {
      return linkBuildingData.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    } else if (template === "salary") {
      return salaryData.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    } else if (template === "tools") {
      return toolsData.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    } else if (template === "other_work") {
      return parseFloat(otherWorkData.amount) || 0;
    }
    return 0;
  };

  const handleGeneratePDF = () => {
    try {
      if (template === "link_building") {
        generateLinkBuildingPDF({ ...linkBuildingData, status: "pending" });
      } else if (template === "salary") {
        generateSalaryPDF({ ...salaryData, status: "pending" });
      } else if (template === "tools") {
        generateToolsPDF({ ...toolsData, status: "pending" });
      } else if (template === "other_work") {
        generateOtherWorkPDF({ ...otherWorkData, status: "pending" });
      }
      toast({
        title: "PDF Generated",
        description: "Your PDF has been downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "PDF Generation Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    const allFields = new Set<string>();

    if (template === "link_building") {
      if (!linkBuildingData.vendorName) {
        errors.push("Vendor Name is required");
        allFields.add("vendorName");
      }
      if (!linkBuildingData.invoiceNumber) {
        errors.push("Invoice Number is required");
        allFields.add("invoiceNumber");
      }
      if (!linkBuildingData.file) {
        errors.push("Invoice file is required");
        allFields.add("file");
      }
      linkBuildingData.items.forEach((item, index) => {
        if (!item.clientProjectType) {
          errors.push(`Line item ${index + 1}: Type is required`);
          allFields.add(`item-${index}-type`);
        }
        if (item.clientProjectType === "client" && !item.selectedClientProject) {
          errors.push(`Line item ${index + 1}: Client is required`);
          allFields.add(`item-${index}-client`);
        }
        if (item.clientProjectType === "project" && !item.selectedClientProject) {
          errors.push(`Line item ${index + 1}: Project is required`);
          allFields.add(`item-${index}-project`);
        }
        if (item.clientProjectType === "other" && !item.customValue) {
          errors.push(`Line item ${index + 1}: Custom value is required`);
          allFields.add(`item-${index}-custom`);
        }
        if (!item.description) {
          errors.push(`Line item ${index + 1}: Description is required`);
          allFields.add(`item-${index}-description`);
        }
        if (!item.amount || parseFloat(item.amount) < 1) {
          errors.push(`Line item ${index + 1}: Valid amount is required (min: 1)`);
          allFields.add(`item-${index}-amount`);
        }
      });
    } else if (template === "salary") {
      if (!salaryData.employeeName) {
        errors.push("Employee Name is required");
        allFields.add("employeeName");
      }
      if (!salaryData.invoiceNumber) {
        errors.push("Invoice Number is required");
        allFields.add("invoiceNumber");
      }
      if (!salaryData.position) {
        errors.push("Position is required");
        allFields.add("position");
      }
      if (!salaryData.paymentMethod) {
        errors.push("Payment Method is required");
        allFields.add("paymentMethod");
      }
      salaryData.items.forEach((item, index) => {
        if (!item.description) {
          errors.push(`Salary item ${index + 1}: Description is required`);
          allFields.add(`salary-item-${index}-description`);
        }
        if (!item.amount || parseFloat(item.amount) < 1) {
          errors.push(`Salary item ${index + 1}: Valid amount is required (min: 1)`);
          allFields.add(`salary-item-${index}-amount`);
        }
      });
    } else if (template === "tools") {
      if (!toolsData.toolName) {
        errors.push("Tool Name is required");
        allFields.add("toolName");
      }
      if (!toolsData.toolCategory) {
        errors.push("Tool Category is required");
        allFields.add("toolCategory");
      }
      if (!toolsData.paymentFrequency) {
        errors.push("Payment Frequency is required");
        allFields.add("paymentFrequency");
      }
      toolsData.items.forEach((item, index) => {
        if (!item.description) {
          errors.push(`Tool item ${index + 1}: Description is required`);
          allFields.add(`tool-item-${index}-description`);
        }
        if (!item.amount || parseFloat(item.amount) < 1) {
          errors.push(`Tool item ${index + 1}: Valid amount is required (min: 1)`);
          allFields.add(`tool-item-${index}-amount`);
        }
      });
    } else if (template === "other_work") {
      if (!otherWorkData.vendorName) {
        errors.push("Vendor Name is required");
        allFields.add("otherVendorName");
      }
      if (!otherWorkData.invoiceNumber) {
        errors.push("Invoice Number is required");
        allFields.add("otherInvoiceNumber");
      }
      if (!otherWorkData.workCategory) {
        errors.push("Work Category is required");
        allFields.add("workCategory");
      }
      if (!otherWorkData.clientProjectType) {
        errors.push("Client/Project Type is required");
        allFields.add("otherClientProjectType");
      }
      if (!otherWorkData.description) {
        errors.push("Description is required");
        allFields.add("otherDescription");
      }
      if (!otherWorkData.amount || parseFloat(otherWorkData.amount) < 1) {
        errors.push("Valid amount is required (min: 1)");
        allFields.add("otherAmount");
      }
      if (!otherWorkData.file) {
        errors.push("Invoice file is required");
        allFields.add("otherFile");
      }
    }

    setValidationErrors(errors);
    setTouchedFields(allFields);
    
    if (errors.length > 0) {
      setShowValidationError(true);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
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
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <CardTitle className="text-2xl text-foreground">
                  {templates.find(t => t.type === template)?.title}
                </CardTitle>
                <div className="lg:max-w-md w-full">
                  <FormInput
                    placeholder="Add a note for this template..."
                    value={templateNote}
                    onChange={(e) => setTemplateNote(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
              </div>
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
                        error={touchedFields.has("vendorName") && !linkBuildingData.vendorName ? "Required" : undefined}
                      />
                      <FormInput
                        label="Invoice Number"
                        required
                        value={linkBuildingData.invoiceNumber}
                        onChange={(e) => setLinkBuildingData({...linkBuildingData, invoiceNumber: e.target.value})}
                        error={touchedFields.has("invoiceNumber") && !linkBuildingData.invoiceNumber ? "Required" : undefined}
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
                        <div key={index} className="space-y-4 p-4 bg-secondary/50 rounded-lg">
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormSelect
                              label="Type"
                              placeholder="Select type"
                              options={clientProjectTypeOptions}
                              value={item.clientProjectType}
                              onValueChange={(value) => {
                                const newItems = [...linkBuildingData.items];
                                newItems[index].clientProjectType = value;
                                newItems[index].selectedClientProject = "";
                                newItems[index].customValue = "";
                                setLinkBuildingData({...linkBuildingData, items: newItems});
                              }}
                              error={touchedFields.has(`item-${index}-type`) && !item.clientProjectType ? "Required" : undefined}
                            />
                            
                            <div>
                              {item.clientProjectType === "client" && (
                                <FormSelect
                                  label="Client"
                                  placeholder="Select client"
                                  options={mockClients}
                                  value={item.selectedClientProject}
                                  onValueChange={(value) => {
                                    const newItems = [...linkBuildingData.items];
                                    newItems[index].selectedClientProject = value;
                                    setLinkBuildingData({...linkBuildingData, items: newItems});
                                  }}
                                  error={touchedFields.has(`item-${index}-client`) && !item.selectedClientProject ? "Required" : undefined}
                                />
                              )}
                              
                              {item.clientProjectType === "project" && (
                                <FormSelect
                                  label="Project"
                                  placeholder="Select project"
                                  options={mockProjects}
                                  value={item.selectedClientProject}
                                  onValueChange={(value) => {
                                    const newItems = [...linkBuildingData.items];
                                    newItems[index].selectedClientProject = value;
                                    setLinkBuildingData({...linkBuildingData, items: newItems});
                                  }}
                                  error={touchedFields.has(`item-${index}-project`) && !item.selectedClientProject ? "Required" : undefined}
                                />
                              )}
                              
                              {item.clientProjectType === "other" && (
                                <FormInput
                                  label="Custom Value"
                                  placeholder="Enter custom value"
                                  value={item.customValue}
                                  onChange={(e) => {
                                    const newItems = [...linkBuildingData.items];
                                    newItems[index].customValue = e.target.value;
                                    setLinkBuildingData({...linkBuildingData, items: newItems});
                                  }}
                                  error={touchedFields.has(`item-${index}-custom`) && !item.customValue ? "Required" : undefined}
                                />
                              )}
                              
                              {!item.clientProjectType && (
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-muted-foreground">
                                    Select type first
                                  </label>
                                  <div className="h-10 rounded-md border border-dashed border-border bg-muted/50 flex items-center justify-center">
                                    <span className="text-xs text-muted-foreground">Choose a type above</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-[2fr,1fr,auto] gap-4">
                            <FormInput
                              placeholder="Description"
                              value={item.description}
                              onChange={(e) => {
                                const newItems = [...linkBuildingData.items];
                                newItems[index].description = e.target.value;
                                setLinkBuildingData({...linkBuildingData, items: newItems});
                              }}
                              error={touchedFields.has(`item-${index}-description`) && !item.description ? "Required" : undefined}
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
                              error={
                                touchedFields.has(`item-${index}-amount`) && (!item.amount || parseFloat(item.amount) < 1)
                                  ? !item.amount ? "Required" : "Amount must be at least 1"
                                  : item.amount && parseFloat(item.amount) < 1 ? "Amount must be at least 1" : undefined
                              }
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
                        </div>
                      ))}
                    </div>

                    <FormSelect
                      label="Currency"
                      options={currencyOptions}
                      value={linkBuildingData.currency}
                      onValueChange={(value) => setLinkBuildingData({...linkBuildingData, currency: value})}
                    />

                    <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary/30">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-foreground">Total Amount:</span>
                        <span className="text-2xl font-bold gradient-text">
                          {calculateTotal().toFixed(2)} {linkBuildingData.currency}
                        </span>
                      </div>
                    </div>

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
                    <div className="grid md:grid-cols-3 gap-4">
                      <FormSelect
                        label="Employee Name"
                        required
                        placeholder="Select employee"
                        options={mockEmployees}
                        value={salaryData.employeeName}
                        onValueChange={(value) => {
                          const selectedEmployee = mockEmployees.find(emp => emp.value === value);
                          setSalaryData({
                            ...salaryData, 
                            employeeName: value,
                            employeeAddress: selectedEmployee?.address || "",
                            position: selectedEmployee?.position || ""
                          });
                        }}
                        error={touchedFields.has("employeeName") && !salaryData.employeeName ? "Required" : undefined}
                      />
                      <FormInput
                        label="Invoice Number"
                        required
                        value={salaryData.invoiceNumber}
                        onChange={(e) => setSalaryData({...salaryData, invoiceNumber: e.target.value})}
                        error={touchedFields.has("invoiceNumber") && !salaryData.invoiceNumber ? "Required" : undefined}
                      />
                      <FormInput
                        label="Date"
                        type="date"
                        required
                        value={salaryData.date}
                        onChange={(e) => setSalaryData({...salaryData, date: e.target.value})}
                      />
                    </div>

                    <FormInput
                      label="Employee Address"
                      required
                      value={salaryData.employeeAddress}
                      onChange={(e) => setSalaryData({...salaryData, employeeAddress: e.target.value})}
                    />

                    <FormInput
                      label="Employee Position"
                      required
                      value={salaryData.position}
                      onChange={(e) => setSalaryData({...salaryData, position: e.target.value})}
                      error={touchedFields.has("position") && !salaryData.position ? "Required" : undefined}
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
                            error={touchedFields.has(`salary-item-${index}-description`) && !item.description ? "Required" : undefined}
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
                            error={
                              touchedFields.has(`salary-item-${index}-amount`) && (!item.amount || parseFloat(item.amount) < 1)
                                ? !item.amount ? "Required" : "Amount must be at least 1"
                                : item.amount && parseFloat(item.amount) < 1 ? "Amount must be at least 1" : undefined
                            }
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

                    <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary/30">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-foreground">Total Amount:</span>
                        <span className="text-2xl font-bold gradient-text">
                          {calculateTotal().toFixed(2)} {salaryData.currency}
                        </span>
                      </div>
                    </div>

                    <FormTextarea
                      label="Payment Method / Bank Details"
                      required
                      value={salaryData.paymentMethod}
                      onChange={(e) => setSalaryData({...salaryData, paymentMethod: e.target.value})}
                      error={touchedFields.has("paymentMethod") && !salaryData.paymentMethod ? "Required" : undefined}
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
                    <div className="grid md:grid-cols-3 gap-4">
                      <FormInput
                        label="Tool Name"
                        required
                        value={toolsData.toolName}
                        onChange={(e) => setToolsData({...toolsData, toolName: e.target.value})}
                        error={touchedFields.has("toolName") && !toolsData.toolName ? "Required" : undefined}
                      />
                      <FormInput
                        label="Tool Category"
                        required
                        value={toolsData.toolCategory}
                        onChange={(e) => setToolsData({...toolsData, toolCategory: e.target.value})}
                        error={touchedFields.has("toolCategory") && !toolsData.toolCategory ? "Required" : undefined}
                      />
                      <FormSelect
                        label="Payment Frequency"
                        required
                        placeholder="Select frequency"
                        options={[
                          { value: "monthly", label: "Monthly" },
                          { value: "annually", label: "Annually" },
                          { value: "one-time", label: "One-Time Payment" },
                        ]}
                        value={toolsData.paymentFrequency}
                        onValueChange={(value) => setToolsData({...toolsData, paymentFrequency: value})}
                        error={touchedFields.has("paymentFrequency") && !toolsData.paymentFrequency ? "Required" : undefined}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">Tool Items</h3>
                        <Button type="button" variant="outline" size="sm" onClick={() => addLineItem("tools")}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Item
                        </Button>
                      </div>
                      {toolsData.items.map((item, index) => (
                        <div key={index} className="p-4 bg-secondary/50 rounded-lg">
                          <div className="grid md:grid-cols-[2fr,1fr,auto] gap-4">
                            <FormInput
                              placeholder="Description"
                              value={item.description}
                              onChange={(e) => {
                                const newItems = [...toolsData.items];
                                newItems[index].description = e.target.value;
                                setToolsData({...toolsData, items: newItems});
                              }}
                              error={touchedFields.has(`tool-item-${index}-description`) && !item.description ? "Required" : undefined}
                            />
                            <FormInput
                              type="number"
                              placeholder="Amount"
                              value={item.amount}
                              onChange={(e) => {
                                const newItems = [...toolsData.items];
                                newItems[index].amount = e.target.value;
                                setToolsData({...toolsData, items: newItems});
                              }}
                              error={
                                touchedFields.has(`tool-item-${index}-amount`) && (!item.amount || parseFloat(item.amount) < 1)
                                  ? !item.amount ? "Required" : "Amount must be at least 1"
                                  : item.amount && parseFloat(item.amount) < 1 ? "Amount must be at least 1" : undefined
                              }
                            />
                            {toolsData.items.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeLineItem("tools", index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <FormSelect
                      label="Currency"
                      options={currencyOptions}
                      value={toolsData.currency}
                      onValueChange={(value) => setToolsData({...toolsData, currency: value})}
                    />

                    <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary/30">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-foreground">Total Amount:</span>
                        <span className="text-2xl font-bold gradient-text">
                          {calculateTotal().toFixed(2)} {toolsData.currency}
                        </span>
                      </div>
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
                        error={touchedFields.has("otherVendorName") && !otherWorkData.vendorName ? "Required" : undefined}
                      />
                      <FormInput
                        label="Invoice Number"
                        required
                        value={otherWorkData.invoiceNumber}
                        onChange={(e) => setOtherWorkData({...otherWorkData, invoiceNumber: e.target.value})}
                        error={touchedFields.has("otherInvoiceNumber") && !otherWorkData.invoiceNumber ? "Required" : undefined}
                      />
                      <FormInput
                        label="Invoice Date"
                        type="date"
                        required
                        value={otherWorkData.invoiceDate}
                        onChange={(e) => setOtherWorkData({...otherWorkData, invoiceDate: e.target.value})}
                      />
                    </div>

                    <FormInput
                      label="Work Category"
                      required
                      value={otherWorkData.workCategory}
                      onChange={(e) => setOtherWorkData({...otherWorkData, workCategory: e.target.value})}
                      error={touchedFields.has("workCategory") && !otherWorkData.workCategory ? "Required" : undefined}
                    />

                    <FormInput
                      label="Client/Project Type"
                      required
                      placeholder="Enter client or project type"
                      value={otherWorkData.clientProjectType}
                      onChange={(e) => setOtherWorkData({...otherWorkData, clientProjectType: e.target.value})}
                      error={touchedFields.has("otherClientProjectType") && !otherWorkData.clientProjectType ? "Required" : undefined}
                    />

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <FormInput
                          label="Description"
                          required
                          value={otherWorkData.description}
                          onChange={(e) => setOtherWorkData({...otherWorkData, description: e.target.value})}
                          error={touchedFields.has("otherDescription") && !otherWorkData.description ? "Required" : undefined}
                        />
                      </div>
                      <FormInput
                        label="Amount"
                        type="number"
                        required
                        value={otherWorkData.amount}
                        onChange={(e) => setOtherWorkData({...otherWorkData, amount: e.target.value})}
                        error={
                          touchedFields.has("otherAmount") && (!otherWorkData.amount || parseFloat(otherWorkData.amount) < 1)
                            ? !otherWorkData.amount ? "Required" : "Amount must be at least 1"
                            : otherWorkData.amount && parseFloat(otherWorkData.amount) < 1 ? "Amount must be at least 1" : undefined
                        }
                      />
                    </div>

                    <FormSelect
                      label="Currency"
                      options={currencyOptions}
                      value={otherWorkData.currency}
                      onValueChange={(value) => setOtherWorkData({...otherWorkData, currency: value})}
                    />

                    <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary/30">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-foreground">Total Amount:</span>
                        <span className="text-2xl font-bold gradient-text">
                          {calculateTotal().toFixed(2)} {otherWorkData.currency}
                        </span>
                      </div>
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

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setTemplate(null)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="button" variant="secondary" onClick={handleGeneratePDF} className="flex-1">
                    <FileDown className="mr-2 h-4 w-4" />
                    Generate PDF
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
      
      <AlertDialog open={showValidationError} onOpenChange={setShowValidationError}>
        <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Required Fields Missing</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Please complete all required fields before submitting:</p>
              <ul className="list-disc list-inside space-y-1 mt-3">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm text-foreground">{error}</li>
                ))}
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowValidationError(false)}>
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

