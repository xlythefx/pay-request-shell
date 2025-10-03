import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Download, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Building,
  DollarSign,
  BarChart3,
  Calendar
} from "lucide-react";
import { requestsAPI } from "@/lib/api";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";

export default function Analytics() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      const response = await requestsAPI.getAll();
      setRequests(response.data || []);
    } catch (error) {
      console.error("Failed to load analytics data", error);
    } finally {
      setLoading(false);
    }
  };

  // Summary Statistics
  const stats = {
    total: requests.length,
    pending: requests.filter((r: any) => r.status === "pending").length,
    approved: requests.filter((r: any) => r.status === "approved").length,
    rejected: requests.filter((r: any) => r.status === "rejected").length,
    totalAmount: requests.reduce((sum: number, r: any) => sum + (r.totalAmount || 0), 0),
  };

  // Department Overview
  const departmentData = requests.reduce((acc: any, req: any) => {
    const dept = req.department || "Unassigned";
    if (!acc[dept]) {
      acc[dept] = { name: dept, total: 0, approved: 0, pending: 0, rejected: 0 };
    }
    acc[dept].total++;
    acc[dept][req.status]++;
    return acc;
  }, {});

  const departmentChartData = Object.values(departmentData);

  // Top Requests (Largest Payments)
  const topRequests = [...requests]
    .sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0))
    .slice(0, 5);

  // Template Usage
  const templateData = requests.reduce((acc: any, req: any) => {
    const template = req.template || "Other";
    acc[template] = (acc[template] || 0) + 1;
    return acc;
  }, {});

  const templateChartData = Object.entries(templateData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  // Monthly Trends (Last 6 months)
  const monthlyData = requests.reduce((acc: any, req: any) => {
    const date = new Date(req.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, requests: 0, approved: 0, pending: 0, rejected: 0 };
    }
    acc[monthKey].requests++;
    acc[monthKey][req.status]++;
    return acc;
  }, {});

  const monthlyChartData = Object.values(monthlyData)
    .sort((a: any, b: any) => a.month.localeCompare(b.month))
    .slice(-6);

  // Status Distribution for Pie Chart
  const statusDistribution = [
    { name: "Approved", value: stats.approved, color: "hsl(var(--success))" },
    { name: "Pending", value: stats.pending, color: "hsl(var(--warning))" },
    { name: "Rejected", value: stats.rejected, color: "hsl(var(--error))" },
  ];

  const handleExportCSV = () => {
    const csvContent = [
      ["Invoice Number", "Vendor/Employee", "Amount", "Status", "Department", "Date"],
      ...requests.map(r => [
        r.invoiceNumber,
        r.vendorName || r.employeeName || r.toolName || "N/A",
        r.totalAmount,
        r.status,
        r.department || "N/A",
        new Date(r.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast({
      title: "Export successful",
      description: "Analytics data exported to CSV",
    });
  };

  const handleExportPDF = () => {
    toast({
      title: "PDF Export",
      description: "PDF export functionality will be available soon",
    });
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-10 w-10 text-primary" />
              <div>
                <h1 className="text-4xl font-bold mb-2 gradient-text">Advanced Analytics</h1>
                <p className="text-muted-foreground text-lg">
                  Actionable insights and data-driven decisions
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExportCSV} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={handleExportPDF} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Summary Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Summary Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
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
        </motion.div>

        {/* Status Distribution & Total Amount */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-foreground">Status Distribution</CardTitle>
                <CardDescription>Overview of request statuses</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Total Payment Amount
                </CardTitle>
                <CardDescription>Cumulative value of all requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="text-6xl font-bold gradient-text mb-2">
                      ${stats.totalAmount.toLocaleString()}
                    </div>
                    <p className="text-muted-foreground">Total requested amount</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Department Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                Department Overview
              </CardTitle>
              <CardDescription>Requests per department with status breakdown</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="approved" fill="hsl(var(--success))" name="Approved" />
                  <Bar dataKey="pending" fill="hsl(var(--warning))" name="Pending" />
                  <Bar dataKey="rejected" fill="hsl(var(--error))" name="Rejected" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Requests & Template Usage */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Top 5 Largest Payments
                </CardTitle>
                <CardDescription>Highest value payment requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topRequests.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No requests yet</p>
                  ) : (
                    topRequests.map((request, index) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {request.vendorName || request.employeeName || request.toolName || "Request"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {request.invoiceNumber}
                            </p>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-primary">
                          ${request.totalAmount?.toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Template Usage
                </CardTitle>
                <CardDescription>Most frequently used templates</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={templateChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      type="number" 
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--accent))" name="Usage Count" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Monthly Trends
              </CardTitle>
              <CardDescription>Request volume and status trends over time</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="requests" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    name="Total Requests"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="approved" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={2}
                    name="Approved"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pending" 
                    stroke="hsl(var(--warning))" 
                    strokeWidth={2}
                    name="Pending"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rejected" 
                    stroke="hsl(var(--error))" 
                    strokeWidth={2}
                    name="Rejected"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
