import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { DataTable, Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FormSelect } from "@/components/FormSelect";
import { Shield } from "lucide-react";
import { usersAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const roleOptions = [
  { value: "employee", label: "Employee" },
  { value: "finance_manager", label: "Finance Manager" },
  { value: "admin", label: "Administrator" },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
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

  const closeDialog = () => {
    setSelectedUser(null);
    setNewRole("");
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-error/20 text-error border-error/50";
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
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedUser(row);
            setNewRole(row.role);
          }}
        >
          <Shield className="h-4 w-4 mr-1" />
          Change Role
        </Button>
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
          <h1 className="text-4xl font-bold mb-2 gradient-text">User Management</h1>
          <p className="text-muted-foreground text-lg">
            Manage user roles and permissions
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
              data={users}
              columns={columns}
              searchPlaceholder="Search users..."
            />
          )}
        </motion.div>
      </div>

      {/* Role Update Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={closeDialog}>
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
    </div>
  );
}
