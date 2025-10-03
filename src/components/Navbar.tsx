import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LogOut, LayoutDashboard, FileText, Users } from "lucide-react";
import { getAuth, clearAuth } from "@/lib/auth";
import { authAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = getAuth();
  const { toast } = useToast();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    await authAPI.logout();
    clearAuth();
    toast({
      title: "Logged out successfully",
    });
    navigate("/login");
  };

  const confirmLogout = () => {
    setShowLogoutDialog(false);
    handleLogout();
  };

  if (!user) return null;

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, roles: ["employee", "finance_manager", "admin"] },
    { label: "Requests", path: "/requests", icon: FileText, roles: ["employee", "finance_manager", "admin"] },
    { label: "Department", path: "/department", icon: FileText, roles: ["finance_manager"] },
    { label: "Users", path: "/admin/users", icon: Users, roles: ["admin"] },
  ];

  const visibleItems = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/dashboard">
          <h1 className="text-2xl font-bold gradient-text">Feature Digital</h1>
        </Link>

        <div className="flex items-center gap-6">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}

          <div className="flex items-center gap-3 ml-4 pl-4 border-l border-border">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role.replace("_", " ")}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowLogoutDialog(true)}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out? You will need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.nav>
  );
};
