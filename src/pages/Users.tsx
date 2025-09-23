import React, { useState } from "react";
import { Plus, Edit, Trash2, Eye, UserCheck, UserX, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function UsersTenants() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [users, setUsers] = useState([
    { id: "1", name: "John Doe", email: "john@acmestore.com", role: "admin", status: "active", tenant: "Acme Store", lastLogin: "2024-01-15", ordersCount: 0 },
    { id: "2", name: "Jane Smith", email: "jane@fashionhub.com", role: "manager", status: "active", tenant: "Fashion Hub", lastLogin: "2024-01-14", ordersCount: 156 },
  ]);
  const [tenants, setTenants] = useState([
    { id: "1", name: "Acme Store", subscription: "Basic", status: "active" },
    { id: "2", name: "Fashion Hub", subscription: "Pro", status: "active" },
  ]);

  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isTenantDialogOpen, setIsTenantDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingTenant, setEditingTenant] = useState(null);

  // ======= Helpers =======
  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase();
  const getStatusBadge = (status: string) => (
    <Badge variant={status === "active" ? "default" : "outline"}>{status}</Badge>
  );
  const getRoleBadge = (role: string) => (
    <Badge variant="outline">{role}</Badge>
  );

  // ======= User Actions =======
  const handleAddUser = (user) => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...user, id: editingUser.id } : u));
      setEditingUser(null);
    } else {
      setUsers([...users, { ...user, id: Date.now().toString() }]);
    }
    setIsUserDialogOpen(false);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsUserDialogOpen(true);
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  // ======= Tenant Actions =======
  const handleAddTenant = (tenant) => {
    if (editingTenant) {
      setTenants(tenants.map(t => t.id === editingTenant.id ? { ...tenant, id: editingTenant.id } : t));
      setEditingTenant(null);
    } else {
      setTenants([...tenants, { ...tenant, id: Date.now().toString() }]);
    }
    setIsTenantDialogOpen(false);
  };

  const handleEditTenant = (tenant) => {
    setEditingTenant(tenant);
    setIsTenantDialogOpen(true);
  };

  const handleDeleteTenant = (id) => {
    setTenants(tenants.filter(t => t.id !== id));
  };

  // ======= Filtered Users =======
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* ===== Users & Tenants Header ===== */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users & Tenants</h1>
        <div className="flex gap-2">
          <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus /> Add User</Button>
            </DialogTrigger>
            <DialogContent>
              <UserForm onSubmit={handleAddUser} initialData={editingUser} onCancel={() => setIsUserDialogOpen(false)} tenants={tenants} />
            </DialogContent>
          </Dialog>
          <Dialog open={isTenantDialogOpen} onOpenChange={setIsTenantDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus /> Add Tenant</Button>
            </DialogTrigger>
            <DialogContent>
              <TenantForm onSubmit={handleAddTenant} initialData={editingTenant} onCancel={() => setIsTenantDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ===== Search & Filters ===== */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Users</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Input placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* ===== Users Table ===== */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(u => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar><AvatarFallback>{getInitials(u.name)}</AvatarFallback></Avatar>
                      {u.name}
                    </div>
                  </TableCell>
                  <TableCell>{u.tenant}</TableCell>
                  <TableCell>{getRoleBadge(u.role)}</TableCell>
                  <TableCell>{getStatusBadge(u.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">Actions</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEditUser(u)}><Edit /> Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteUser(u.id)} className="text-destructive"><Trash2 /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ===== Tenants Table ===== */}
      <Card>
        <CardHeader>
          <CardTitle>Tenants</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map(t => (
                <TableRow key={t.id}>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.subscription}</TableCell>
                  <TableCell>{getStatusBadge(t.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">Actions</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEditTenant(t)}><Edit /> Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteTenant(t.id)} className="text-destructive"><Trash2 /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ======= User Form Component =======
function UserForm({ onSubmit, initialData, onCancel, tenants }) {
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [role, setRole] = useState(initialData?.role || "user");
  const [tenant, setTenant] = useState(initialData?.tenant || tenants[0]?.name || "");
  const [status, setStatus] = useState(initialData?.status || "active");

  const handleSubmit = () => {
    if (!name || !email) return alert("Please fill all fields");
    onSubmit({ name, email, role, tenant, status, lastLogin: "Never", ordersCount: 0 });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit User" : "Add User"}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Input placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
        <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
        <Select value={tenant} onValueChange={setTenant}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {tenants.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>{initialData ? "Update" : "Add"}</Button>
      </DialogFooter>
    </>
  );
}

// ======= Tenant Form Component =======
function TenantForm({ onSubmit, initialData, onCancel }) {
  const [name, setName] = useState(initialData?.name || "");
  const [subscription, setSubscription] = useState(initialData?.subscription || "Basic");
  const [status, setStatus] = useState(initialData?.status || "active");

  const handleSubmit = () => {
    if (!name) return alert("Please fill tenant name");
    onSubmit({ name, subscription, status });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Tenant" : "Add Tenant"}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Input placeholder="Tenant Name" value={name} onChange={e => setName(e.target.value)} />
        <Select value={subscription} onValueChange={setSubscription}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Basic">Basic</SelectItem>
            <SelectItem value="Pro">Pro</SelectItem>
            <SelectItem value="Enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>{initialData ? "Update" : "Add"}</Button>
      </DialogFooter>
    </>
  );
}
