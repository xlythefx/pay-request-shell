import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/StatusBadge";
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
  Calendar,
  ArrowRight
} from "lucide-react";
import { requestsAPI } from "@/lib/api";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";

export default function Analytics() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      // Mock data for visualization
      const mockData = [
        {
          id: 1,
          type: "vendor",
          vendorName: "Tech Solutions Inc",
          invoiceNumber: "INV-2024-001",
          totalAmount: 5000,
          currency: "USD",
          status: "approved",
          department: "IT",
          createdAt: "2024-09-15T10:30:00",
          template: "Software",
          description: "Annual software license renewal for project management tools",
          items: [{ description: "Project Management Software - Annual License", amount: 5000 }],
          paymentMethod: "Bank Transfer",
          managerNote: "Approved for annual renewal. Critical software for operations.",
          file: "invoice-001.pdf",
        },
        {
          id: 2,
          type: "employee",
          employeeName: "John Smith",
          invoiceNumber: "EXP-2024-045",
          totalAmount: 3200,
          currency: "USD",
          status: "pending",
          department: "Marketing",
          createdAt: "2024-10-02T14:20:00",
          template: "Travel",
          description: "Business trip to client meeting in New York",
          items: [
            { description: "Flight tickets", amount: 1200 },
            { description: "Hotel accommodation (3 nights)", amount: 1500 },
            { description: "Meals and transportation", amount: 500 },
          ],
          paymentMethod: "Corporate Card Reimbursement",
          file: "travel-receipt-045.pdf",
        },
        {
          id: 3,
          type: "vendor",
          vendorName: "Cloud Services Co",
          invoiceNumber: "INV-2024-112",
          totalAmount: 8500,
          currency: "USD",
          status: "rejected",
          department: "IT",
          createdAt: "2024-08-20T09:15:00",
          template: "Software",
          description: "Enterprise cloud hosting upgrade",
          items: [{ description: "Cloud hosting upgrade - 6 months", amount: 8500 }],
          paymentMethod: "Bank Transfer",
          managerNote: "Rejected - budget exceeded for Q3. Please resubmit in Q4 with proper justification.",
          file: "invoice-112.pdf",
        },
        {
          id: 4,
          type: "tool",
          toolName: "Adobe Creative Suite",
          invoiceNumber: "SUB-2024-078",
          totalAmount: 2400,
          currency: "USD",
          status: "approved",
          department: "Design",
          createdAt: "2024-09-30T11:45:00",
          template: "Subscription",
          description: "Annual subscription for design team tools",
          items: [{ description: "Adobe Creative Cloud - Team License (5 users)", amount: 2400 }],
          paymentMethod: "Credit Card",
          managerNote: "Approved - essential tools for design team productivity.",
          file: "adobe-invoice-078.pdf",
        },
        {
          id: 5,
          type: "employee",
          employeeName: "Sarah Johnson",
          invoiceNumber: "EXP-2024-089",
          totalAmount: 450,
          currency: "USD",
          status: "approved",
          department: "HR",
          createdAt: "2024-10-10T16:00:00",
          template: "Office Supplies",
          description: "Office supplies for new employee onboarding",
          items: [
            { description: "Ergonomic chairs (2x)", amount: 300 },
            { description: "Desk accessories and supplies", amount: 150 },
          ],
          paymentMethod: "Corporate Card",
          managerNote: "Approved - necessary for new hires comfort and productivity.",
          file: "supplies-089.pdf",
        },
        {
          id: 6,
          type: "vendor",
          vendorName: "DataBase Systems Ltd",
          invoiceNumber: "INV-2024-156",
          totalAmount: 12000,
          currency: "USD",
          status: "approved",
          department: "IT",
          createdAt: "2024-07-10T08:30:00",
          template: "Software",
          description: "Database management system upgrade and maintenance",
          items: [
            { description: "Enterprise Database License", amount: 9000 },
            { description: "Annual Support & Maintenance", amount: 3000 },
          ],
          paymentMethod: "Bank Transfer",
          managerNote: "Approved - critical infrastructure upgrade.",
          file: "invoice-156.pdf",
        },
        {
          id: 7,
          type: "employee",
          employeeName: "Michael Chen",
          invoiceNumber: "EXP-2024-123",
          totalAmount: 1850,
          currency: "USD",
          status: "pending",
          department: "Sales",
          createdAt: "2024-10-14T13:25:00",
          template: "Travel",
          description: "Client meeting in Chicago",
          items: [
            { description: "Round trip flight", amount: 800 },
            { description: "Hotel (2 nights)", amount: 600 },
            { description: "Meals and transportation", amount: 450 },
          ],
          paymentMethod: "Corporate Card Reimbursement",
          file: "travel-123.pdf",
        },
        {
          id: 8,
          type: "vendor",
          vendorName: "Office Furniture Co",
          invoiceNumber: "INV-2024-201",
          totalAmount: 6800,
          currency: "USD",
          status: "approved",
          department: "HR",
          createdAt: "2024-08-05T10:00:00",
          template: "Office Supplies",
          description: "New office furniture for expansion",
          items: [
            { description: "Standing desks (10x)", amount: 5000 },
            { description: "Office chairs (10x)", amount: 1800 },
          ],
          paymentMethod: "Bank Transfer",
          managerNote: "Approved - office expansion for new team members.",
          file: "invoice-201.pdf",
        },
        {
          id: 9,
          type: "tool",
          toolName: "Slack Enterprise",
          invoiceNumber: "SUB-2024-098",
          totalAmount: 3600,
          currency: "USD",
          status: "approved",
          department: "IT",
          createdAt: "2024-09-01T09:00:00",
          template: "Subscription",
          description: "Annual enterprise communication platform",
          items: [{ description: "Slack Enterprise Grid - Annual", amount: 3600 }],
          paymentMethod: "Credit Card",
          managerNote: "Approved - company-wide communication tool.",
          file: "slack-098.pdf",
        },
        {
          id: 10,
          type: "employee",
          employeeName: "Emma Davis",
          invoiceNumber: "EXP-2024-067",
          totalAmount: 280,
          currency: "USD",
          status: "rejected",
          department: "Marketing",
          createdAt: "2024-10-08T15:30:00",
          template: "Office Supplies",
          description: "Marketing materials and office supplies",
          items: [
            { description: "Printing supplies", amount: 150 },
            { description: "Marketing materials", amount: 130 },
          ],
          paymentMethod: "Corporate Card",
          managerNote: "Rejected - duplicate request. Already ordered last week.",
          file: "expense-067.pdf",
        },
        {
          id: 11,
          type: "vendor",
          vendorName: "Security Systems Pro",
          invoiceNumber: "INV-2024-178",
          totalAmount: 4200,
          currency: "USD",
          status: "approved",
          department: "Operations",
          createdAt: "2024-07-25T12:00:00",
          template: "Hardware",
          description: "Office security system upgrade",
          items: [
            { description: "Security cameras (8x)", amount: 2400 },
            { description: "Access control system", amount: 1800 },
          ],
          paymentMethod: "Bank Transfer",
          managerNote: "Approved - security compliance requirement.",
          file: "invoice-178.pdf",
        },
        {
          id: 12,
          type: "employee",
          employeeName: "Alex Rodriguez",
          invoiceNumber: "EXP-2024-145",
          totalAmount: 4500,
          currency: "USD",
          status: "pending",
          department: "Sales",
          createdAt: "2024-10-12T11:15:00",
          template: "Travel",
          description: "Trade show attendance in Las Vegas",
          items: [
            { description: "Flight tickets", amount: 1200 },
            { description: "Hotel (4 nights)", amount: 2000 },
            { description: "Conference registration", amount: 800 },
            { description: "Meals and ground transport", amount: 500 },
          ],
          paymentMethod: "Corporate Card Reimbursement",
          file: "travel-145.pdf",
        },
        {
          id: 13,
          type: "vendor",
          vendorName: "Marketing Agency Plus",
          invoiceNumber: "INV-2024-220",
          totalAmount: 15000,
          currency: "USD",
          status: "approved",
          department: "Marketing",
          createdAt: "2024-06-30T14:00:00",
          template: "Services",
          description: "Q3 Marketing campaign services",
          items: [
            { description: "Social media campaign management", amount: 7000 },
            { description: "Content creation and design", amount: 5000 },
            { description: "Analytics and reporting", amount: 3000 },
          ],
          paymentMethod: "Bank Transfer",
          managerNote: "Approved - Q3 marketing budget allocation.",
          file: "invoice-220.pdf",
        },
        {
          id: 14,
          type: "tool",
          toolName: "GitHub Enterprise",
          invoiceNumber: "SUB-2024-111",
          totalAmount: 2100,
          currency: "USD",
          status: "approved",
          department: "IT",
          createdAt: "2024-08-15T10:30:00",
          template: "Subscription",
          description: "Annual code repository and collaboration platform",
          items: [{ description: "GitHub Enterprise - 25 users", amount: 2100 }],
          paymentMethod: "Credit Card",
          managerNote: "Approved - essential development tool.",
          file: "github-111.pdf",
        },
        {
          id: 15,
          type: "employee",
          employeeName: "Lisa Wang",
          invoiceNumber: "EXP-2024-172",
          totalAmount: 950,
          currency: "USD",
          status: "approved",
          department: "Design",
          createdAt: "2024-10-01T09:45:00",
          template: "Training",
          description: "Professional development - UX Design workshop",
          items: [
            { description: "Workshop registration", amount: 750 },
            { description: "Materials and books", amount: 200 },
          ],
          paymentMethod: "Corporate Card",
          managerNote: "Approved - valuable skill development for team.",
          file: "training-172.pdf",
        },
        {
          id: 16,
          type: "vendor",
          vendorName: "Legal Services Inc",
          invoiceNumber: "INV-2024-189",
          totalAmount: 7500,
          currency: "USD",
          status: "approved",
          department: "Operations",
          createdAt: "2024-07-18T16:20:00",
          template: "Services",
          description: "Legal consultation and contract review",
          items: [
            { description: "Contract review services", amount: 4500 },
            { description: "Legal consultation hours", amount: 3000 },
          ],
          paymentMethod: "Bank Transfer",
          managerNote: "Approved - required legal services for new partnerships.",
          file: "invoice-189.pdf",
        },
        {
          id: 17,
          type: "employee",
          employeeName: "David Kim",
          invoiceNumber: "EXP-2024-203",
          totalAmount: 320,
          currency: "USD",
          status: "rejected",
          department: "IT",
          createdAt: "2024-10-09T13:50:00",
          template: "Office Supplies",
          description: "Personal equipment upgrade",
          items: [
            { description: "Wireless mouse and keyboard", amount: 180 },
            { description: "Monitor stand", amount: 140 },
          ],
          paymentMethod: "Corporate Card",
          managerNote: "Rejected - not a business necessity. Company equipment provided.",
          file: "expense-203.pdf",
        },
        {
          id: 18,
          type: "vendor",
          vendorName: "Insurance Corp",
          invoiceNumber: "INV-2024-245",
          totalAmount: 18000,
          currency: "USD",
          status: "approved",
          department: "Operations",
          createdAt: "2024-06-15T11:00:00",
          template: "Services",
          description: "Annual business insurance premium",
          items: [
            { description: "General liability insurance", amount: 10000 },
            { description: "Professional liability insurance", amount: 8000 },
          ],
          paymentMethod: "Bank Transfer",
          managerNote: "Approved - annual insurance renewal.",
          file: "invoice-245.pdf",
        },
        {
          id: 19,
          type: "employee",
          employeeName: "Rachel Green",
          invoiceNumber: "EXP-2024-188",
          totalAmount: 2200,
          currency: "USD",
          status: "pending",
          department: "Marketing",
          createdAt: "2024-10-11T10:20:00",
          template: "Travel",
          description: "Marketing conference in San Francisco",
          items: [
            { description: "Flight tickets", amount: 650 },
            { description: "Hotel (3 nights)", amount: 1100 },
            { description: "Conference registration", amount: 300 },
            { description: "Transportation and meals", amount: 150 },
          ],
          paymentMethod: "Corporate Card Reimbursement",
          file: "travel-188.pdf",
        },
        {
          id: 20,
          type: "vendor",
          vendorName: "Internet Services ISP",
          invoiceNumber: "INV-2024-267",
          totalAmount: 1200,
          currency: "USD",
          status: "approved",
          department: "IT",
          createdAt: "2024-09-20T08:00:00",
          template: "Services",
          description: "Quarterly internet and network services",
          items: [{ description: "Business internet - Q4 2024", amount: 1200 }],
          paymentMethod: "Bank Transfer",
          managerNote: "Approved - essential business service.",
          file: "invoice-267.pdf",
        },
      ];
      
      setRequests(mockData);
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

        {/* Tabs for different views */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="glass-effect">
            <TabsTrigger value="overview" className="border border-border/50">Overview</TabsTrigger>
            <TabsTrigger value="timeline" className="border border-border/50">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Summary Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
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
      </TabsContent>

      <TabsContent value="timeline" className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Request Status Timeline
              </CardTitle>
              <CardDescription>Chronological view of all request status changes</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {requests.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No requests yet</p>
              ) : (
                <div className="relative">
                  {/* Horizontal timeline container */}
                  <div className="flex gap-6 pb-8 min-w-max">
                    {[...requests]
                      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                      .map((request, index) => (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="relative flex flex-col items-center"
                        >
                          {/* Timeline card */}
                          <div 
                            className="w-72 bg-secondary/50 border border-border rounded-lg p-4 cursor-pointer hover:border-primary/50 hover:bg-secondary/70 hover:scale-105 transition-all mb-6"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <h3 className="font-semibold text-foreground text-sm">
                                      {request.vendorName || request.employeeName || request.toolName || "Request"}
                                    </h3>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                      request.status === 'approved' 
                                        ? 'bg-success/20 text-success' 
                                        : request.status === 'rejected'
                                        ? 'bg-error/20 text-error'
                                        : 'bg-warning/20 text-warning'
                                    }`}>
                                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {request.invoiceNumber}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {request.department || "Unassigned"}
                                  </p>
                                </div>
                              </div>
                              
                              <div>
                                <p className="font-bold text-primary text-lg">
                                  ${request.totalAmount?.toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(request.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              
                              {/* Status progression */}
                              <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                                <div className="flex items-center gap-1 text-xs">
                                  <FileText className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-muted-foreground">Created</span>
                                </div>
                                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                <div className="flex items-center gap-1 text-xs">
                                  {request.status === 'pending' ? (
                                    <Clock className="h-3 w-3 text-warning" />
                                  ) : request.status === 'approved' ? (
                                    <CheckCircle className="h-3 w-3 text-success" />
                                  ) : (
                                    <XCircle className="h-3 w-3 text-error" />
                                  )}
                                  <span className={
                                    request.status === 'pending' 
                                      ? 'text-warning' 
                                      : request.status === 'approved'
                                      ? 'text-success'
                                      : 'text-error'
                                  }>
                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Timeline dot and line */}
                          <div className="relative flex items-center">
                            <div className={`w-6 h-6 rounded-full border-4 z-10 ${
                              request.status === 'approved' 
                                ? 'bg-success border-success shadow-lg shadow-success/50' 
                                : request.status === 'rejected'
                                ? 'bg-error border-error shadow-lg shadow-error/50'
                                : 'bg-warning border-warning shadow-lg shadow-warning/50'
                            }`} />
                            
                            {/* Connecting line to next item */}
                            {index < requests.length - 1 && (
                              <div className="absolute left-6 w-24 h-1 bg-gradient-to-r from-primary/50 to-primary/20" />
                            )}
                          </div>
                          
                          {/* Date label below timeline */}
                          <div className="mt-4 text-center">
                            <p className="text-xs font-medium text-foreground">
                              {new Date(request.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(request.createdAt).toLocaleDateString('en-US', { year: 'numeric' })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                  
                  {/* Scroll indicator for mobile */}
                  <div className="md:hidden flex justify-center gap-2 mt-4">
                    <div className="h-1 w-20 bg-primary/30 rounded-full" />
                    <p className="text-xs text-muted-foreground">Scroll horizontally →</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </TabsContent>
    </Tabs>
      </div>

      {/* Request Details Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto glass-effect">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center justify-between">
                  <span>Payment Request #{selectedRequest.id}</span>
                  <StatusBadge status={selectedRequest.status} />
                </DialogTitle>
                <DialogDescription className="capitalize text-base">
                  {selectedRequest.type.replace("_", " ")} Payment
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-muted-foreground">Vendor/Employee</label>
                    <p className="text-lg font-medium text-foreground">
                      {selectedRequest.vendorName || 
                       selectedRequest.employeeName || 
                       selectedRequest.toolName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Invoice Number</label>
                    <p className="text-lg font-medium text-foreground">
                      {selectedRequest.invoiceNumber || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Department</label>
                    <p className="text-lg font-medium text-foreground">
                      {selectedRequest.department || "Unassigned"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Total Amount</label>
                    <p className="text-2xl font-bold gradient-text">
                      ${selectedRequest.totalAmount?.toLocaleString()} {selectedRequest.currency}
                    </p>
                  </div>
                </div>

                {/* Line Items */}
                {selectedRequest.items && selectedRequest.items.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Line Items</h3>
                    <div className="space-y-2">
                      {selectedRequest.items.map((item: any, index: number) => (
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

                {/* Description */}
                {selectedRequest.description && (
                  <div>
                    <label className="text-sm text-muted-foreground">Description</label>
                    <p className="mt-2 text-foreground whitespace-pre-wrap">
                      {selectedRequest.description}
                    </p>
                  </div>
                )}

                {/* Payment Method */}
                {selectedRequest.paymentMethod && (
                  <div>
                    <label className="text-sm text-muted-foreground">Payment Method</label>
                    <p className="mt-2 text-foreground">{selectedRequest.paymentMethod}</p>
                  </div>
                )}

                {/* Manager Note / Comments */}
                {selectedRequest.managerNote && (
                  <div className={`p-4 rounded-lg border ${
                    selectedRequest.status === "approved" 
                      ? "bg-success/10 border-success/30" 
                      : selectedRequest.status === "rejected"
                      ? "bg-error/10 border-error/30"
                      : "bg-secondary/50 border-border"
                  }`}>
                    <label className="text-sm font-semibold text-foreground">
                      {selectedRequest.status === "approved" && "Approval Comment"}
                      {selectedRequest.status === "rejected" && "Rejection Reason"}
                      {selectedRequest.status === "pending" && "Manager Note"}
                    </label>
                    <p className="mt-2 text-foreground">{selectedRequest.managerNote}</p>
                  </div>
                )}

                {/* Attached Documents */}
                {selectedRequest.file && (
                  <div>
                    <label className="text-sm text-muted-foreground mb-3 block">
                      Attached Documents
                    </label>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          toast({
                            title: "View Document",
                            description: `Opening ${selectedRequest.file}`,
                          });
                        }}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        View {selectedRequest.file}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          toast({
                            title: "Download Started",
                            description: `Downloading ${selectedRequest.file}`,
                          });
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="pt-4 border-t border-border">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-muted-foreground">Created</label>
                      <p className="text-foreground">
                        {new Date(selectedRequest.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {selectedRequest.template && (
                      <div>
                        <label className="text-muted-foreground">Template Used</label>
                        <p className="text-foreground">{selectedRequest.template}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
