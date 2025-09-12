import React, { useState } from "react";
import { Search, Plus, Edit, Trash2, Eye, Truck, MapPin, Phone, Mail, Star } from "lucide-react";
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

export default function Delivery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  const mockDeliveryCompanies = [
    {
      id: "1",
      name: "FastShip Express",
      email: "contact@fastship.com",
      phone: "+1-555-0123",
      address: "123 Logistics Ave, New York, NY 10001",
      status: "active",
      rating: 4.8,
      totalDeliveries: 12847,
      onTimeRate: 96.5,
      avgDeliveryTime: "2.3 days",
      costPerDelivery: "$8.50",
      coverageAreas: ["New York", "New Jersey", "Connecticut"],
      specialServices: ["Same Day", "Express", "Fragile Items"]
    },
    {
      id: "2",
      name: "QuickDeliver",
      email: "support@quickdeliver.com",
      phone: "+1-555-0456",
      address: "456 Fast Lane, Los Angeles, CA 90210",
      status: "active",
      rating: 4.6,
      totalDeliveries: 8934,
      onTimeRate: 94.2,
      avgDeliveryTime: "2.8 days",
      costPerDelivery: "$7.25",
      coverageAreas: ["California", "Nevada", "Arizona"],
      specialServices: ["Same Day", "Cold Chain", "Signature Required"]
    },
    {
      id: "3",
      name: "SpeedyCourier",
      email: "info@speedycourier.com",
      phone: "+1-555-0789",
      address: "789 Delivery St, Chicago, IL 60601",
      status: "active",
      rating: 4.4,
      totalDeliveries: 6521,
      onTimeRate: 91.8,
      avgDeliveryTime: "3.2 days",
      costPerDelivery: "$6.90",
      coverageAreas: ["Illinois", "Indiana", "Wisconsin"],
      specialServices: ["Express", "Bulk Orders", "Return Service"]
    },
    {
      id: "4",
      name: "ReliableShipping",
      email: "hello@reliableshipping.com",
      phone: "+1-555-0321",
      address: "321 Trust Rd, Houston, TX 77001",
      status: "pending",
      rating: 4.2,
      totalDeliveries: 3245,
      onTimeRate: 89.3,
      avgDeliveryTime: "3.8 days",
      costPerDelivery: "$6.50",
      coverageAreas: ["Texas", "Oklahoma", "Louisiana"],
      specialServices: ["Economy", "Standard", "Insurance"]
    },
    {
      id: "5",
      name: "GlobalExpress",
      email: "contact@globalexpress.com",
      phone: "+1-555-0654",
      address: "654 International Blvd, Miami, FL 33101",
      status: "inactive",
      rating: 3.9,
      totalDeliveries: 1892,
      onTimeRate: 85.6,
      avgDeliveryTime: "4.5 days",
      costPerDelivery: "$9.20",
      coverageAreas: ["Florida", "Georgia", "South Carolina"],
      specialServices: ["International", "Customs", "Tracking"]
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: "default" as const, className: "status-success" },
      pending: { variant: "secondary" as const, className: "status-warning" },
      inactive: { variant: "outline" as const, className: "status-destructive" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const handleEdit = (company: any) => {
    setSelectedCompany(company);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Delivery Companies</h1>
          <p className="text-muted-foreground">Manage your delivery partners and logistics providers</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Delivery Company</DialogTitle>
              <DialogDescription>
                Register a new delivery partner for your logistics operations.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" placeholder="FastShip Express" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input id="contactEmail" type="email" placeholder="contact@company.com" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+1-555-0123" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costPerDelivery">Cost per Delivery</Label>
                  <Input id="costPerDelivery" placeholder="$8.50" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="123 Logistics Ave, New York, NY 10001" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="coverageAreas">Coverage Areas</Label>
                <Input id="coverageAreas" placeholder="New York, New Jersey, Connecticut" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialServices">Special Services</Label>
                <Input id="specialServices" placeholder="Same Day, Express, Fragile Items" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Additional information about the delivery company..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-gradient-primary hover:opacity-90">
                Add Company
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
              <Truck className="h-4 w-4 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Active Partners</p>
                <p className="text-2xl font-bold">{mockDeliveryCompanies.filter(c => c.status === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Deliveries</p>
              <p className="text-2xl font-bold">{mockDeliveryCompanies.reduce((sum, c) => sum + c.totalDeliveries, 0).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Avg On-Time Rate</p>
              <p className="text-2xl font-bold text-success">
                {(mockDeliveryCompanies.reduce((sum, c) => sum + c.onTimeRate, 0) / mockDeliveryCompanies.length).toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Avg Cost</p>
              <p className="text-2xl font-bold text-primary">
                ${(mockDeliveryCompanies.reduce((sum, c) => sum + parseFloat(c.costPerDelivery.replace('$', '')), 0) / mockDeliveryCompanies.length).toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Companies</CardTitle>
          <CardDescription>Search and filter delivery partners</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by company name, location, or services..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Delivery Partners</CardTitle>
              <CardDescription>
                Showing {mockDeliveryCompanies.length} delivery companies
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Deliveries</TableHead>
                  <TableHead>On-Time Rate</TableHead>
                  <TableHead>Avg Time</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDeliveryCompanies.map((company) => (
                  <TableRow key={company.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{company.name}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{company.coverageAreas.slice(0, 2).join(", ")}</span>
                          {company.coverageAreas.length > 2 && <span>+{company.coverageAreas.length - 2}</span>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(company.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getRatingStars(company.rating)}
                        <span className="text-sm ml-1">{company.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{company.totalDeliveries.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{company.onTimeRate}%</span>
                        <div className="w-16 h-2 bg-muted rounded-full">
                          <div 
                            className="h-full bg-success rounded-full" 
                            style={{ width: `${company.onTimeRate}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{company.avgDeliveryTime}</TableCell>
                    <TableCell className="font-medium">{company.costPerDelivery}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleEdit(company)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Company
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="h-4 w-4 mr-2" />
                            Contact
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Partner
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

      {/* Edit Company Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Delivery Company</DialogTitle>
            <DialogDescription>
              Update delivery partner information and settings.
            </DialogDescription>
          </DialogHeader>
          {selectedCompany && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editCompanyName">Company Name</Label>
                  <Input id="editCompanyName" defaultValue={selectedCompany.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editContactEmail">Contact Email</Label>
                  <Input id="editContactEmail" type="email" defaultValue={selectedCompany.email} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editPhone">Phone Number</Label>
                  <Input id="editPhone" defaultValue={selectedCompany.phone} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editCost">Cost per Delivery</Label>
                  <Input id="editCost" defaultValue={selectedCompany.costPerDelivery} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editStatus">Status</Label>
                <Select defaultValue={selectedCompany.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editAddress">Address</Label>
                <Input id="editAddress" defaultValue={selectedCompany.address} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-gradient-primary hover:opacity-90">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}