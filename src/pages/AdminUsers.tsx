import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { DataTable, Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FormSelect } from "@/components/FormSelect";
import { FormInput } from "@/components/FormInput";
import { Shield, UserPlus, Edit, Archive, AlertTriangle } from "lucide-react";
import { usersAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const roleOptions = [
  { value: "employee", label: "Employee" },
  { value: "finance_manager", label: "Finance Manager" },
  { value: "manager", label: "Manager" },
  { value: "admin", label: "Administrator" },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dialogType, setDialogType] = useState<"role" | "add" | "edit" | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ type: "archive"; user: any } | null>(null);
  
  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    role: "employee",
  });
  
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await usersAPI.getAll();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async () => {
    if (!selectedUser || !newRole) return;

    setSubmitting(true);
    try {
      await usersAPI.updateRole(selectedUser.id, newRole);
      toast({
        title: "Role updated",
        description: `${selectedUser.name}'s role has been updated to ${newRole.replace("_", " ")}`,
      });
      closeDialog();
      loadUsers();
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddUser = async () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Validation error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Mock API call
      const newUser = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        ...formData,
      };
      setUsers([...users, newUser]);
      toast({
        title: "User added",
        description: `${formData.name} has been added successfully`,
      });
      closeDialog();
    } catch (error) {
      toast({
        title: "Failed to add user",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser || !formData.name || !formData.email) {
      toast({
        title: "Validation error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Mock API call
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...formData } : u));
      toast({
        title: "User updated",
        description: `${formData.name}'s information has been updated`,
      });
      closeDialog();
    } catch (error) {
      toast({
        title: "Failed to update user",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchiveUser = async () => {
    if (!confirmAction?.user) return;

    setSubmitting(true);
    try {
      // Mock API call - remove user from list
      setUsers(users.filter(u => u.id !== confirmAction.user.id));
      toast({
        title: "User archived",
        description: `${confirmAction.user.name} has been archived`,
      });
      setConfirmAction(null);
      loadUsers();
    } catch (error) {
      toast({
        title: "Failed to archive user",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openAddDialog = () => {
    setFormData({ name: "", email: "", department: "", role: "employee" });
    setDialogType("add");
  };

  const openEditDialog = (user: any) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      department: user.department || "",
      role: user.role,
    });
    setDialogType("edit");
  };

  const openRoleDialog = (user: any) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setDialogType("role");
  };

  const closeDialog = () => {
    setSelectedUser(null);
    setNewRole("");
    setDialogType(null);
    setFormData({ name: "", email: "", department: "", role: "employee" });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-error/20 text-error border-error/50";
      case "manager":
        return "bg-primary/20 text-primary border-primary/50";
      case "finance_manager":
        return "bg-warning/20 text-warning border-warning/50";
      default:
        return "bg-accent/20 text-accent border-accent/50";
    }
  };

  const columns: Column<any>[] = [
    {
      key: "id",
      label: "ID",
      sortable: true,
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "department",
      label: "Department",
      render: (value) => value || "N/A",
      sortable: true,
    },
    {
      key: "role",
      label: "Role",
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(value)}`}>
          {value.replace("_", " ").toUpperCase()}
        </span>
      ),
      sortable: true,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => openEditDialog(row)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => openRoleDialog(row)}
          >
            <Shield className="h-4 w-4 mr-1" />
            Role
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setConfirmAction({ type: "archive", user: row })}
          >
            <Archive className="h-4 w-4 mr-1" />
            Archive
          </Button>
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
              <h1 className="text-4xl font-bold mb-2 gradient-text">User Management</h1>
              <p className="text-muted-foreground text-lg">
                Manage user roles and permissions
              </p>
            </div>
            <Button onClick={openAddDialog}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
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
              data={users}
              columns={columns}
              searchPlaceholder="Search users..."
            />
          )}
        </motion.div>
      </div>

      {/* Role Update Dialog */}
      <Dialog open={dialogType === "role"} onOpenChange={closeDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Update User Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground">User</p>
              <p className="font-semibold text-foreground">{selectedUser?.name}</p>
              <p className="text-sm text-muted-foreground mt-1">{selectedUser?.email}</p>
            </div>
            <FormSelect
              label="New Role"
              options={roleOptions}
              value={newRole}
              onValueChange={setNewRole}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleRoleUpdate} disabled={submitting || newRole === selectedUser?.role}>
              {submitting ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={dialogType === "add"} onOpenChange={closeDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <FormInput
              id="name"
              label="Full Name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <FormInput
              id="email"
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <FormInput
              id="department"
              label="Department"
              placeholder="Marketing"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
            <FormSelect
              label="Role"
              options={roleOptions}
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} disabled={submitting}>
              {submitting ? "Adding..." : "Add User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={dialogType === "edit"} onOpenChange={closeDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <FormInput
              id="name"
              label="Full Name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <FormInput
              id="email"
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <FormInput
              id="department"
              label="Department"
              placeholder="Marketing"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
            <FormSelect
              label="Role"
              options={roleOptions}
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleEditUser} disabled={submitting}>
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Confirmation Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Archive User
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive <strong>{confirmAction?.user?.name}</strong>? 
              This will remove their access to the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleArchiveUser} 
              disabled={submitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {submitting ? "Archiving..." : "Archive User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
