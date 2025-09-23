import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, Send, TrendingUp, Percent } from "lucide-react";

export default function Reports() {
  const [stats, setStats] = useState({
    totalAudiences: 0,
    totalCampaigns: 0,
    avgOpenRate: 0,
    avgConversionRate: 0,
  });

  const [performanceData, setPerformanceData] = useState<any[]>([]);

  useEffect(() => {
    // 🔗 Mock data – remplacera avec ton backend Spring Boot plus tard
    setStats({
      totalAudiences: 12,
      totalCampaigns: 34,
      avgOpenRate: 58,
      avgConversionRate: 23,
    });

    setPerformanceData([
      { month: "Jan", campaigns: 5, openRate: 45, conversionRate: 20 },
      { month: "Feb", campaigns: 8, openRate: 52, conversionRate: 25 },
      { month: "Mar", campaigns: 6, openRate: 60, conversionRate: 28 },
      { month: "Apr", campaigns: 10, openRate: 64, conversionRate: 30 },
      { month: "May", campaigns: 7, openRate: 55, conversionRate: 22 },
    ]);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Analytics & Reports</h1>
      <p className="text-muted-foreground">
        Visualize your campaigns and audience performance over time
      </p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Audiences</p>
              <p className="text-2xl font-bold">{stats.totalAudiences}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Send className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Campaigns</p>
              <p className="text-2xl font-bold">{stats.totalCampaigns}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Avg Open Rate</p>
              <p className="text-2xl font-bold">{stats.avgOpenRate}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Percent className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Avg Conversion</p>
              <p className="text-2xl font-bold">{stats.avgConversionRate}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="openRate">Open Rate</TabsTrigger>
          <TabsTrigger value="conversionRate">Conversion Rate</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Campaigns per Month</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="campaigns" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="openRate">
          <Card>
            <CardHeader>
              <CardTitle>Open Rate Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="openRate" stroke="#10b981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversionRate">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Rate Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="conversionRate" stroke="#f97316" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
