import React, { useState } from "react";
import { Search, Plus, Users, Filter, Eye, Edit, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

export default function Audiences() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const mockAudiences = [
    {
      id: "1",
      name: "VIP Customers",
      description: "High-value customers with orders > $1000",
      totalCustomers: 142,
      criteria: ["Order Value > $1000", "Lifetime Value > $5000", "Orders Count > 10"],
      status: "active",
      lastUpdated: "2024-01-15",
      avgOrderValue: "$1,247",
      conversionRate: 8.4,
      engagement: 92
    },
    {
      id: "2",
      name: "Inactive Customers",
      description: "Customers who haven't ordered in 90+ days",
      totalCustomers: 327,
      criteria: ["Last Order > 90 days", "Total Orders < 5"],
      status: "active",
      lastUpdated: "2024-01-14",
      avgOrderValue: "$89",
      conversionRate: 2.1,
      engagement: 23
    },
    {
      id: "3",
      name: "New Customers",
      description: "Customers who joined in the last 30 days",
      totalCustomers: 89,
      criteria: ["Registration Date < 30 days", "First Purchase"],
      status: "active",
      lastUpdated: "2024-01-15",
      avgOrderValue: "$156",
      conversionRate: 12.3,
      engagement: 67
    },
    {
      id: "4",
      name: "Mobile Users",
      description: "Customers who primarily shop via mobile app",
      totalCustomers: 234,
      criteria: ["Device Type = Mobile", "App Sessions > 5"],
      status: "draft",
      lastUpdated: "2024-01-12",
      avgOrderValue: "$98",
      conversionRate: 5.7,
      engagement: 45
    },
    {
      id: "5",
      name: "Cart Abandoners",
      description: "Users with items in cart but no recent purchase",
      totalCustomers: 156,
      criteria: ["Cart Value > $50", "No Purchase in 7 days"],
      status: "active",
      lastUpdated: "2024-01-13",
      avgOrderValue: "$167",
      conversionRate: 15.8,
      engagement: 34
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: "default" as const, className: "status-success" },
      draft: { variant: "secondary" as const, className: "status-warning" },
      archived: { variant: "outline" as const, className: "" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 70) return "text-success";
    if (engagement >= 40) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audience Management</h1>
          <p className="text-muted-foreground">Create and manage customer segments for targeted campaigns</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate("/audience-results")}>
            <Eye className="h-4 w-4 mr-2" />
            View Results
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90" onClick={() => navigate("/audience-builder")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Audience
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Audiences</p>
                <p className="text-2xl font-bold">{mockAudiences.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Active Audiences</p>
              <p className="text-2xl font-bold text-success">{mockAudiences.filter(a => a.status === "active").length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Customers</p>
              <p className="text-2xl font-bold">{mockAudiences.reduce((sum, a) => sum + a.totalCustomers, 0).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Avg Conversion</p>
              <p className="text-2xl font-bold text-primary">
                {(mockAudiences.reduce((sum, a) => sum + a.conversionRate, 0) / mockAudiences.length).toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Audiences</CardTitle>
          <CardDescription>Search and filter your customer segments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search audiences by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audiences Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockAudiences.map((audience) => (
          <Card key={audience.id} className="interactive-card hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {audience.name}
                    {getStatusBadge(audience.status)}
                  </CardTitle>
                  <CardDescription className="mt-1">{audience.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Audience
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Export List
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Audience
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Customer Count */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Customers</span>
                <span className="font-bold text-lg">{audience.totalCustomers.toLocaleString()}</span>
              </div>

              {/* Criteria */}
              <div>
                <p className="text-sm font-medium mb-2">Criteria:</p>
                <div className="flex flex-wrap gap-1">
                  {audience.criteria.map((criterion, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {criterion}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Avg Order Value</p>
                  <p className="font-medium">{audience.avgOrderValue}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Conversion Rate</p>
                  <p className="font-medium">{audience.conversionRate}%</p>
                </div>
              </div>

              {/* Engagement Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Engagement Score</span>
                  <span className={`font-medium ${getEngagementColor(audience.engagement)}`}>
                    {audience.engagement}%
                  </span>
                </div>
                <Progress value={audience.engagement} className="h-2" />
              </div>

              {/* Last Updated */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                <span>Last updated: {new Date(audience.lastUpdated).toLocaleDateString()}</span>
                <Button size="sm" variant="outline" onClick={() => navigate("/audience-builder")}>
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common audience operations and tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate("/audience-builder")}>
              <Plus className="h-5 w-5" />
              Create New Audience
            </Button>
            
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate("/audience-results")}>
              <Eye className="h-5 w-5" />
              View All Results
            </Button>
            
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Download className="h-5 w-5" />
              Export All Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}