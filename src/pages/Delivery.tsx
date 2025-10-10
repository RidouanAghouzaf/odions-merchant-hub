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

  const API_BASE = "http://localhost:5000/api/delivery-companies";

  // Fetch delivery companies
  useEffect(() => {
    fetch(API_BASE, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCompanies(data.delivery_companies || []))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // Save or update company
  const handleSave = async () => {
    const method = editingCompany ? "PUT" : "POST";
    const url = editingCompany ? `${API_BASE}/${editingCompany.id}` : API_BASE;

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (response.ok) {
      if (editingCompany) {
        setCompanies((prev) =>
          prev.map((c) => (c.id === editingCompany.id ? data.delivery_company : c))
        );
      } else {
        setCompanies((prev) => [...prev, data.delivery_company]);
      }
    } else {
      alert(data.error?.message || "Failed to save company");
    }

    setOpenDialog(false);
    setEditingCompany(null);
    setForm({ name: "", email: "", phone: "", country: "", status: true });
  };

  // Delete company
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this company?")) return;
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      setCompanies(companies.filter((c) => c.id !== id));
    } else {
      const err = await response.json();
      alert(err.error?.message || "Failed to delete");
    }
  };

  // Toggle status
  const toggleStatus = async (company: DeliveryCompany, newStatus: boolean) => {
    const response = await fetch(`${API_BASE}/${company.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      setCompanies((prev) =>
        prev.map((c) => (c.id === company.id ? { ...c, status: newStatus } : c))
      );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Delivery Companies</h1>
        <Button
          onClick={() => {
            setEditingCompany(null);
            setForm({ name: "", email: "", phone: "", country: "", status: true });
            setOpenDialog(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Delivery Company
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <table className="w-full text-left border-collapse">
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
              {companies.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.email}</td>
                  <td className="p-2">{c.phone}</td>
                  <td className="p-2">{c.country}</td>
                  <td className="p-2">
                    <Switch
                      checked={c.status}
                      onCheckedChange={(checked) => toggleStatus(c, checked)}
                    />
                  </td>
                  <td className="p-2 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingCompany(c);
                        setForm({
                          name: c.name,
                          email: c.email,
                          phone: c.phone,
                          country: c.country,
                          status: c.status,
                        });
                        setOpenDialog(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(c.id)}
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

      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCompany ? "Edit Company" : "Add Delivery Company"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Company Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Input
              placeholder="Country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
            <div className="flex items-center justify-between">
              <span>Active</span>
              <Switch
                checked={form.status}
                onCheckedChange={(checked) => setForm({ ...form, status: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingCompany ? "Save Changes" : "Add Company"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
