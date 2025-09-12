import React, { useState } from "react";
import { Search, Plus, Play, Pause, Edit, Trash2, Send, Users, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Campaigns() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const mockCampaigns = [
    {
      id: "1",
      name: "Summer Sale 2024",
      status: "active",
      type: "Email",
      audience: "VIP Customers",
      sent: 1250,
      opened: 892,
      clicked: 234,
      converted: 89,
      startDate: "2024-01-10",
      endDate: "2024-01-31",
      budget: "$2,500"
    },
    {
      id: "2",
      name: "New Product Launch",
      status: "completed",
      type: "SMS",
      audience: "All Customers",
      sent: 850,
      opened: 623,
      clicked: 145,
      converted: 67,
      startDate: "2024-01-05",
      endDate: "2024-01-15",
      budget: "$1,800"
    },
    {
      id: "3",
      name: "Customer Retention",
      status: "scheduled",
      type: "Email",
      audience: "Inactive Customers",
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      startDate: "2024-01-20",
      endDate: "2024-01-27",
      budget: "$1,200"
    },
    {
      id: "4",
      name: "Flash Weekend Deal",
      status: "draft",
      type: "Push",
      audience: "Mobile Users",
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      startDate: "2024-01-25",
      endDate: "2024-01-26",
      budget: "$800"
    },
    {
      id: "5",
      name: "Holiday Special",
      status: "paused",
      type: "Email",
      audience: "High Value Customers",
      sent: 432,
      opened: 298,
      clicked: 67,
      converted: 23,
      startDate: "2024-01-12",
      endDate: "2024-01-19",
      budget: "$3,200"
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: "default" as const, className: "status-success animate-pulse-glow" },
      completed: { variant: "outline" as const, className: "status-success" },
      scheduled: { variant: "secondary" as const, className: "status-warning" },
      draft: { variant: "outline" as const, className: "" },
      paused: { variant: "destructive" as const, className: "status-destructive" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getOpenRate = (sent: number, opened: number) => {
    if (sent === 0) return 0;
    return Math.round((opened / sent) * 100);
  };

  const getClickRate = (opened: number, clicked: number) => {
    if (opened === 0) return 0;
    return Math.round((clicked / opened) * 100);
  };

  const getConversionRate = (sent: number, converted: number) => {
    if (sent === 0) return 0;
    return Math.round((converted / sent) * 100);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campaign Management</h1>
          <p className="text-muted-foreground">Create, manage, and track your marketing campaigns</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Set up a new marketing campaign to engage with your customers.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaignName">Campaign Name</Label>
                  <Input id="campaignName" placeholder="Enter campaign name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaignType">Campaign Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="push">Push Notification</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="vip">VIP Customers</SelectItem>
                    <SelectItem value="new">New Customers</SelectItem>
                    <SelectItem value="inactive">Inactive Customers</SelectItem>
                    <SelectItem value="high-value">High Value Customers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Campaign Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Write your campaign message here..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input id="budget" placeholder="$0.00" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Save as Draft
              </Button>
              <Button className="bg-gradient-primary hover:opacity-90">
                Create & Launch
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold">{mockCampaigns.filter(c => c.status === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Sent</p>
              <p className="text-2xl font-bold">{mockCampaigns.reduce((sum, c) => sum + c.sent, 0).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Average Open Rate</p>
              <p className="text-2xl font-bold text-success">
                {Math.round(mockCampaigns.reduce((sum, c) => sum + getOpenRate(c.sent, c.opened), 0) / mockCampaigns.filter(c => c.sent > 0).length)}%
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Conversions</p>
              <p className="text-2xl font-bold text-primary">{mockCampaigns.reduce((sum, c) => sum + c.converted, 0)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Campaigns</CardTitle>
          <CardDescription>Search and filter your marketing campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Campaigns</CardTitle>
              <CardDescription>
                Showing {mockCampaigns.length} campaigns
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCampaigns.map((campaign) => (
                  <TableRow key={campaign.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-muted-foreground">{campaign.type}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{campaign.audience}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Sent: {campaign.sent.toLocaleString()}</span>
                          <span>Open: {getOpenRate(campaign.sent, campaign.opened)}%</span>
                        </div>
                        <Progress value={getOpenRate(campaign.sent, campaign.opened)} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Clicked: {campaign.clicked}</span>
                          <span>Conv: {getConversionRate(campaign.sent, campaign.converted)}%</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>
                        <p>{new Date(campaign.startDate).toLocaleDateString()}</p>
                        <p className="text-muted-foreground">to {new Date(campaign.endDate).toLocaleDateString()}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{campaign.budget}</TableCell>
                    <TableCell className="text-right">
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
                            Edit Campaign
                          </DropdownMenuItem>
                          {campaign.status === "active" ? (
                            <DropdownMenuItem>
                              <Pause className="h-4 w-4 mr-2" />
                              Pause Campaign
                            </DropdownMenuItem>
                          ) : campaign.status === "paused" ? (
                            <DropdownMenuItem>
                              <Play className="h-4 w-4 mr-2" />
                              Resume Campaign
                            </DropdownMenuItem>
                          ) : null}
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Campaign
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}