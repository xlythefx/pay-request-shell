import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import { Navbar } from "@/components/Navbar";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock, CheckCircle, XCircle, Plus, TrendingUp } from "lucide-react";
import { requestsAPI } from "@/lib/api";
import { getAuth } from "@/lib/auth";
import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/StatusBadge";

export default function Dashboard() {
  const { user } = getAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [recentRequests, setRecentRequests] = useState<any[]>([]);

  useEffect(() => {
    AOS.init();
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await requestsAPI.getAll();
      const requests = response.data || [];
      
      setStats({
        total: requests.length,
        pending: requests.filter((r: any) => r.status === "pending").length,
        approved: requests.filter((r: any) => r.status === "approved").length,
        rejected: requests.filter((r: any) => r.status === "rejected").length,
      });
      
      setRecentRequests(requests.slice(0, 5));
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    }
  };

  const statCards = [
    {
      title: "Total Requests",
      value: stats.total,
      icon: FileText,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Approved",
      value: stats.approved,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: "text-error",
      bgColor: "bg-error/10",
    },
  ];

  return (
    <div className="min-h-screen">
      <BackgroundAnimation />
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Here's what's happening with your payment requests today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <Card className="glass-effect hover:border-primary/50 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Requests */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
            data-aos="fade-right"
          >
            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">Recent Requests</CardTitle>
                <Link to="/requests">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {recentRequests.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No requests yet</p>
                ) : (
                  <div className="space-y-4">
                    {recentRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-foreground">
                            {request.vendorName || request.employeeName || request.toolName || "Request"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {request.invoiceNumber} • {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-primary">
                            ${request.totalAmount}
                          </span>
                          <StatusBadge status={request.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            data-aos="fade-left"
          >
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/requests/create">
                  <Button className="w-full justify-start" variant="default">
                    <Plus className="mr-2 h-4 w-4" />
                    New Payment Request
                  </Button>
                </Link>
                <Link to="/requests">
                  <Button className="w-full justify-start" variant="secondary">
                    <FileText className="mr-2 h-4 w-4" />
                    View All Requests
                  </Button>
                </Link>
                <Link to="/analytics">
                  <Button className="w-full justify-start" variant="secondary">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
