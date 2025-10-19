import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface DeliveryCompany {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  status: boolean;
}

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJUZXN0VXNlciIsImlhdCI6MTc2MDg5MTM1MCwiZXhwIjoxNzYwODk0OTUwfQ.lQb2-EB-HIcp3A7BmWmvXcdvzmtSfoxkm30lEqtJVuY";

const isValidToken = (token: string) => token.split(".").length === 3;

export default function DeliveryCompanies() {
  const [companies, setCompanies] = useState<DeliveryCompany[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCompany, setEditingCompany] = useState<DeliveryCompany | null>(null);
  const [form, setForm] = useState<Omit<DeliveryCompany, "id">>({
    name: "",
    email: "",
    phone: "",
    country: "",
    status: true,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    country: "",
    status: "all", // all | active | inactive
  });

  const API_BASE = "http://localhost:5000/api/delivery-companies";

  const getAuthHeader = () => {
    if (!TOKEN || !isValidToken(TOKEN)) {
      setMessage({ type: "error", text: "Invalid or missing token. Please check your authentication." });
      throw new Error("Invalid token");
    }
    return `Bearer ${TOKEN}`;
  };

  const apiCall = async (
    url: string,
    options: RequestInit = {}
  ): Promise<{ ok: boolean; data: any; status: number }> => {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          Authorization: getAuthHeader(),
          ...(options.headers || {}),
        },
      });
      const data = await res.json();
      return { ok: res.ok, data, status: res.status };
    } catch (err) {
      console.error("API call error:", err);
      return { ok: false, data: null, status: 0 };
    }
  };

  const fetchCompanies = async () => {
    const { ok, data, status } = await apiCall(API_BASE);
    if (status === 401) {
      setMessage({ type: "error", text: "Unauthorized. Please log in again." });
      return;
    }
    if (ok) {
      setCompanies(data.delivery_companies || []);
    } else {
      setMessage({ type: "error", text: "Failed to load companies." });
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSave = async () => {
    if (!form.name || !form.email || !form.phone || !form.country) {
      setMessage({ type: "error", text: "All fields are required." });
      return;
    }

    setLoading(true);
    const method = editingCompany ? "PUT" : "POST";
    const url = editingCompany ? `${API_BASE}/${editingCompany.id}` : API_BASE;

    const { ok, data, status } = await apiCall(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (status === 401) {
      setMessage({ type: "error", text: "Unauthorized. Please log in again." });
      return;
    }

    if (!ok) {
      setMessage({ type: "error", text: data.error?.message || "Failed to save company." });
      return;
    }

    await fetchCompanies();
    closeDialog();
    setMessage({
      type: "success",
      text: editingCompany ? "Company updated successfully." : "Company added successfully.",
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this company?")) return;

    setLoading(true);
    const { ok, data, status } = await apiCall(`${API_BASE}/${id}`, {
      method: "DELETE",
    });
    setLoading(false);

    if (status === 401) {
      setMessage({ type: "error", text: "Unauthorized. Please log in again." });
      return;
    }
    if (!ok) {
      setMessage({ type: "error", text: data.error?.message || "Failed to delete company." });
      return;
    }

    await fetchCompanies();
    setMessage({ type: "success", text: "Company deleted successfully." });
  };

  const toggleStatus = async (company: DeliveryCompany, newStatus: boolean) => {
    const { ok, status } = await apiCall(`${API_BASE}/${company.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (ok) {
      setCompanies((prev) =>
        prev.map((c) => (c.id === company.id ? { ...c, status: newStatus } : c))
      );
      setMessage({ type: "success", text: `Status updated for ${company.name}.` });
    } else if (status === 401) {
      setMessage({ type: "error", text: "Unauthorized. Please log in again." });
    }
  };

  const openDialogToAdd = () => {
    setEditingCompany(null);
    setForm({ name: "", email: "", phone: "", country: "", status: true });
    setOpenDialog(true);
  };

  const openDialogToEdit = (company: DeliveryCompany) => {
    setEditingCompany(company);
    setForm({
      name: company.name,
      email: company.email,
      phone: company.phone,
      country: company.country,
      status: company.status,
    });
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setEditingCompany(null);
    setForm({ name: "", email: "", phone: "", country: "", status: true });
  };

  const Toast = () =>
    message ? (
      <div
        className={`fixed bottom-6 right-6 px-4 py-2 rounded shadow text-white z-50 cursor-pointer ${
          message.type === "success" ? "bg-green-600" : "bg-red-600"
        }`}
        onClick={() => setMessage(null)}
        role="alert"
      >
        {message.text}
      </div>
    ) : null;

  return (
    <div className="p-6 space-y-6 relative">
      <Toast />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Delivery Companies</h1>
        <Button onClick={openDialogToAdd} disabled={loading}>
          <Plus className="w-4 h-4 mr-2" /> Add Delivery Company
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4 overflow-x-auto">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <Input
              placeholder="Filter by Name"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              className="w-[200px]"
            />
            <Input
              placeholder="Filter by Email"
              value={filters.email}
              onChange={(e) => setFilters({ ...filters, email: e.target.value })}
              className="w-[200px]"
            />
            <Input
              placeholder="Filter by Country"
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
              className="w-[200px]"
            />
            <select
              className="border rounded px-3 py-2 text-sm"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Table */}
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Country</th>
                <th className="p-2">Status</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies
                .filter((c) =>
                  c.name.toLowerCase().includes(filters.name.toLowerCase())
                )
                .filter((c) =>
                  c.email.toLowerCase().includes(filters.email.toLowerCase())
                )
                .filter((c) =>
                  c.country.toLowerCase().includes(filters.country.toLowerCase())
                )
                .filter((c) =>
                  filters.status === "all"
                    ? true
                    : filters.status === "active"
                    ? c.status
                    : !c.status
                )
                .map((c) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{c.name}</td>
                    <td className="p-2">{c.email}</td>
                    <td className="p-2">{c.phone}</td>
                    <td className="p-2">{c.country}</td>
                    <td className="p-2">
                      <Switch
                        checked={c.status}
                        onCheckedChange={(checked) => toggleStatus(c, checked)}
                        disabled={loading}
                      />
                    </td>
                    <td className="p-2 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDialogToEdit(c)}
                        disabled={loading}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(c.id)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCompany ? "Edit Company" : "Add Delivery Company"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Company Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={loading}
            />
            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={loading}
            />
            <Input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              disabled={loading}
            />
            <Input
              placeholder="Country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              disabled={loading}
            />
            <div className="flex items-center justify-between">
              <span>Active</span>
              <Switch
                checked={form.status}
                onCheckedChange={(checked) => setForm({ ...form, status: checked })}
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {editingCompany ? "Save Changes" : "Add Company"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
