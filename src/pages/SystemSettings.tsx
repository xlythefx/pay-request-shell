import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FormInput } from "@/components/FormInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Plus, Edit, Trash2, Building, Shield, FileText, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Department {
  id: number;
  name: string;
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

interface Template {
  id: string;
  name: string;
  enabled: boolean;
}

interface CompanyInfo {
  name: string;
  logo: string;
}

export default function SystemSettings() {
  const [departments, setDepartments] = useState<Department[]>([
    { id: 1, name: "Marketing" },
    { id: 2, name: "IT" },
    { id: 3, name: "HR" },
    { id: 4, name: "Finance" },
  ]);

  const [roles, setRoles] = useState<Role[]>([
    { id: "finance_manager", name: "Finance Manager", permissions: ["approve_payments", "view_all_requests", "generate_reports"] },
    { id: "manager", name: "Manager", permissions: ["view_department_requests", "manage_users", "system_settings"] },
  ]);

  const [templates, setTemplates] = useState<Template[]>([
    { id: "salary", name: "Salary", enabled: true },
    { id: "tools", name: "Tools", enabled: true },
    { id: "link_building", name: "Link building", enabled: true },
  ]);

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "Feature Digital",
    logo: "/placeholder.svg",
  });

  const [dialogType, setDialogType] = useState<"department_add" | "department_edit" | "company" | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ type: "delete_department"; id: number } | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [departmentName, setDepartmentName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const { toast } = useToast();

  const handleAddDepartment = () => {
    if (!departmentName.trim()) {
      toast({
        title: "Validation error",
        description: "Department name is required",
        variant: "destructive",
      });
      return;
    }

    const newDepartment = {
      id: Math.max(...departments.map(d => d.id), 0) + 1,
      name: departmentName,
    };
    setDepartments([...departments, newDepartment]);
    toast({
      title: "Department added",
      description: `${departmentName} has been added successfully`,
    });
    closeDialog();
  };

  const handleEditDepartment = () => {
    if (!selectedDepartment || !departmentName.trim()) {
      toast({
        title: "Validation error",
        description: "Department name is required",
        variant: "destructive",
      });
      return;
    }

    setDepartments(departments.map(d => 
      d.id === selectedDepartment.id ? { ...d, name: departmentName } : d
    ));
    toast({
      title: "Department updated",
      description: `Department has been updated to ${departmentName}`,
    });
    closeDialog();
  };

  const handleDeleteDepartment = () => {
    if (!confirmAction) return;

    setDepartments(departments.filter(d => d.id !== confirmAction.id));
    toast({
      title: "Department deleted",
      description: "Department has been removed",
    });
    setConfirmAction(null);
  };

  const handleTemplateToggle = (templateId: string, enabled: boolean) => {
    setTemplates(templates.map(t => 
      t.id === templateId ? { ...t, enabled } : t
    ));
    const template = templates.find(t => t.id === templateId);
    toast({
      title: enabled ? "Template enabled" : "Template disabled",
      description: `${template?.name} template has been ${enabled ? "enabled" : "disabled"}`,
    });
  };

  const handleUpdateCompanyInfo = () => {
    toast({
      title: "Company info updated",
      description: "Company information has been saved",
    });
    closeDialog();
  };

  const openAddDepartmentDialog = () => {
    setDepartmentName("");
    setDialogType("department_add");
  };

  const openEditDepartmentDialog = (dept: Department) => {
    setSelectedDepartment(dept);
    setDepartmentName(dept.name);
    setDialogType("department_edit");
  };

  const openCompanyDialog = () => {
    setDialogType("company");
  };

  const closeDialog = () => {
    setDialogType(null);
    setSelectedDepartment(null);
    setDepartmentName("");
  };

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
          <div className="flex items-start gap-3">
            <Settings className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-4xl font-bold mb-2 gradient-text">System Settings</h1>
              <p className="text-muted-foreground text-lg">
                Configure departments, roles, templates, and company information
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="departments" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6" style={{ backgroundColor: '#C38E32' }}>
              <TabsTrigger value="departments" className="flex items-center gap-2 data-[state=inactive]:text-[#0F1215]">
                <Building className="h-4 w-4" />
                Departments
              </TabsTrigger>
              <TabsTrigger value="roles" className="flex items-center gap-2 data-[state=inactive]:text-[#0F1215]">
                <Shield className="h-4 w-4" />
                Roles
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2 data-[state=inactive]:text-[#0F1215]">
                <FileText className="h-4 w-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center gap-2 data-[state=inactive]:text-[#0F1215]">
                <Image className="h-4 w-4" />
                Company Info
              </TabsTrigger>
            </TabsList>

            {/* Departments Tab */}
            <TabsContent value="departments">
              <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Manage Departments</CardTitle>
                      <CardDescription>Add, edit, or remove department names</CardDescription>
                    </div>
                    <Button onClick={openAddDepartmentDialog}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Department
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {departments.map((dept) => (
                      <div
                        key={dept.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border hover:bg-secondary transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Building className="h-5 w-5 text-primary" />
                          <span className="font-medium text-foreground">{dept.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDepartmentDialog(dept)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setConfirmAction({ type: "delete_department", id: dept.id })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Roles Tab */}
            <TabsContent value="roles">
              <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardHeader>
                  <CardTitle>Manage Roles</CardTitle>
                  <CardDescription>Default permissions for each role</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {roles.map((role) => (
                      <div
                        key={role.id}
                        className="p-4 rounded-lg bg-secondary/50 border border-border"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Shield className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-foreground">{role.name}</h3>
                        </div>
                        <div className="pl-8 space-y-1">
                          {role.permissions.map((permission) => (
                            <div key={permission} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                              {permission.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates">
              <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardHeader>
                  <CardTitle>Template Settings</CardTitle>
                  <CardDescription>Enable or disable payment request templates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <Label htmlFor={`template-${template.id}`} className="font-medium text-foreground cursor-pointer">
                            {template.name}
                          </Label>
                        </div>
                        <Switch
                          id={`template-${template.id}`}
                          checked={template.enabled}
                          onCheckedChange={(checked) => handleTemplateToggle(template.id, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Company Info Tab */}
            <TabsContent value="company">
              <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>Update company details for PDFs and invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div>
                            <Label className="text-sm text-muted-foreground">Company Name</Label>
                            <p className="text-lg font-semibold text-foreground">{companyInfo.name}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Logo</Label>
                            <div className="mt-2 flex items-center gap-3">
                              <div className="w-16 h-16 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <Image className="h-8 w-8 text-primary" />
                              </div>
                              <span className="text-sm text-muted-foreground">{companyInfo.logo}</span>
                            </div>
                          </div>
                        </div>
                        <Button onClick={openCompanyDialog}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Add Department Dialog */}
      <Dialog open={dialogType === "department_add"} onOpenChange={closeDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add New Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <FormInput
              id="department-name"
              label="Department Name"
              placeholder="e.g., Sales"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={handleAddDepartment}>
              Add Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog open={dialogType === "department_edit"} onOpenChange={closeDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <FormInput
              id="department-name"
              label="Department Name"
              placeholder="e.g., Sales"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={handleEditDepartment}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Company Info Dialog */}
      <Dialog open={dialogType === "company"} onOpenChange={closeDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Company Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <FormInput
              id="company-name"
              label="Company Name"
              placeholder="Feature Digital"
              value={companyInfo.name}
              onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
              required
            />
            <FormInput
              id="company-logo"
              label="Logo URL"
              placeholder="/path/to/logo.png"
              value={companyInfo.logo}
              onChange={(e) => setCompanyInfo({ ...companyInfo, logo: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCompanyInfo}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Department Confirmation Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Department</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this department? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteDepartment}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
