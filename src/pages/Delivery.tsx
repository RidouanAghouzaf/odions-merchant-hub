import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface DeliveryCompany {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  isActive: boolean;
}

export default function DeliveryCompanies() {
  const [companies, setCompanies] = useState<DeliveryCompany[]>([
    { id: 1, name: "DHL Express", email: "contact@dhl.com", phone: "+212600000001", country: "Morocco", isActive: true },
    { id: 2, name: "FedEx", email: "support@fedex.com", phone: "+212600000002", country: "France", isActive: false },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingCompany, setEditingCompany] = useState<DeliveryCompany | null>(null);
  const [form, setForm] = useState<Omit<DeliveryCompany, "id">>({
    name: "",
    email: "",
    phone: "",
    country: "",
    isActive: true,
  });

  const handleSave = () => {
    if (editingCompany) {
      setCompanies(companies.map(c => (c.id === editingCompany.id ? { ...editingCompany, ...form } : c)));
    } else {
      setCompanies([...companies, { id: Date.now(), ...form }]);
    }
    setOpenDialog(false);
    setEditingCompany(null);
    setForm({ name: "", email: "", phone: "", country: "", isActive: true });
  };

  const handleDelete = (id: number) => {
    setCompanies(companies.filter(c => c.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Delivery Companies</h1>
        <Button onClick={() => setOpenDialog(true)}>
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
                      checked={c.isActive}
                      onCheckedChange={(checked) =>
                        setCompanies(companies.map(co => (co.id === c.id ? { ...co, isActive: checked } : co)))
                      }
                    />
                  </td>
                  <td className="p-2 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingCompany(c);
                        setForm(c);
                        setOpenDialog(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(c.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Modal */}
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
                checked={form.isActive}
                onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingCompany ? "Save Changes" : "Add Company"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
