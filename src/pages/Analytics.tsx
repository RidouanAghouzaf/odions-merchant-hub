import React, { useState } from "react";
import { BarChart3, TrendingUp, Users, DollarSign, ShoppingCart, Calendar, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function Analytics() {
  const [dateRange, setDateRange] = useState("30");

  const mockMetrics = {
    totalRevenue: 284392,
    totalOrders: 2847,
    avgOrderValue: 127.50,
    conversionRate: 3.2,
    customerRetention: 68.5,
    customerLifetimeValue: 892.30
  };

  const mockSegments = [
    { name: "VIP Customers", count: 142, percentage: 10, revenue: 89234, color: "bg-primary" },
    { name: "Regular Customers", count: 857, percentage: 60, revenue: 145678, color: "bg-secondary" },
    { name: "New Customers", count: 430, percentage: 30, revenue: 49480, color: "bg-muted" },
  ];

  const mockCampaignPerformance = [
    { name: "Summer Sale 2024", sent: 1250, opened: 892, clicked: 234, converted: 89, roi: "285%" },
    { name: "New Product Launch", sent: 850, opened: 623, clicked: 145, converted: 67, roi: "198%" },
    { name: "Customer Retention", sent: 650, opened: 445, clicked: 89, converted: 34, roi: "156%" },
  ];

  const mockSentiment = {
    positive: 72,
    neutral: 21,
    negative: 7
  };

  const mockRecommendations = [
    {
      type: "Campaign Optimization",
      title: "Increase SMS campaign frequency",
      description: "SMS campaigns show 40% higher conversion rates than email",
      impact: "High",
      effort: "Low"
    },
    {
      type: "Customer Retention",
      title: "Create loyalty program for VIP customers",
      description: "VIP customers generate 3x more revenue but churn rate is increasing",
      impact: "High",
      effort: "Medium"
    },
    {
      type: "Inventory Management",
      title: "Stock up on trending categories",
      description: "Electronics and fashion categories show 25% growth this month",
      impact: "Medium",
      effort: "Low"
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "text-success";
      case "Medium": return "text-warning";
      case "Low": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
          <p className="text-muted-foreground">Comprehensive business intelligence and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold">${mockMetrics.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-sm text-success font-medium">+18.2%</span>
                  <span className="text-sm text-muted-foreground">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-3xl font-bold">{mockMetrics.totalOrders.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-sm text-success font-medium">+12.5%</span>
                  <span className="text-sm text-muted-foreground">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-secondary/10 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-3xl font-bold">${mockMetrics.avgOrderValue}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-sm text-success font-medium">+8.1%</span>
                  <span className="text-sm text-muted-foreground">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <BarChart3 className="h-6 w-6 text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Segmentation */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Segmentation</CardTitle>
          <CardDescription>Breakdown of your customer base by value and behavior</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockSegments.map((segment, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${segment.color}`}></div>
                    <span className="font-medium">{segment.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">{segment.count} customers</span>
                    <p className="text-sm text-muted-foreground">${segment.revenue.toLocaleString()} revenue</p>
                  </div>
                </div>
                <Progress value={segment.percentage} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{segment.percentage}% of total customers</span>
                  <span>${(segment.revenue / segment.count).toFixed(2)} avg per customer</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>Detailed analysis of your marketing campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium">Campaign</th>
                  <th className="text-right py-3 font-medium">Sent</th>
                  <th className="text-right py-3 font-medium">Opened</th>
                  <th className="text-right py-3 font-medium">Clicked</th>
                  <th className="text-right py-3 font-medium">Converted</th>
                  <th className="text-right py-3 font-medium">ROI</th>
                </tr>
              </thead>
              <tbody>
                {mockCampaignPerformance.map((campaign, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-4 font-medium">{campaign.name}</td>
                    <td className="py-4 text-right">{campaign.sent.toLocaleString()}</td>
                    <td className="py-4 text-right">
                      <div>
                        {campaign.opened.toLocaleString()}
                        <span className="text-sm text-muted-foreground ml-1">
                          ({Math.round((campaign.opened / campaign.sent) * 100)}%)
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <div>
                        {campaign.clicked.toLocaleString()}
                        <span className="text-sm text-muted-foreground ml-1">
                          ({Math.round((campaign.clicked / campaign.opened) * 100)}%)
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <div>
                        {campaign.converted}
                        <span className="text-sm text-muted-foreground ml-1">
                          ({Math.round((campaign.converted / campaign.sent) * 100)}%)
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <Badge className="status-success">{campaign.roi}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Analysis & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Sentiment Analysis</CardTitle>
            <CardDescription>Overall customer satisfaction across all touchpoints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-success font-medium">Positive</span>
                <span className="font-bold">{mockSentiment.positive}%</span>
              </div>
              <Progress value={mockSentiment.positive} className="h-3" />
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Neutral</span>
                <span className="font-bold">{mockSentiment.neutral}%</span>
              </div>
              <Progress value={mockSentiment.neutral} className="h-3" />
              
              <div className="flex items-center justify-between">
                <span className="text-destructive font-medium">Negative</span>
                <span className="font-bold">{mockSentiment.negative}%</span>
              </div>
              <Progress value={mockSentiment.negative} className="h-3" />

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Overall Score:</strong> {mockSentiment.positive}% positive sentiment indicates
                  excellent customer satisfaction. Continue current service levels.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
            <CardDescription>Data-driven suggestions to improve your business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecommendations.map((rec, index) => (
                <div key={index} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Badge variant="outline" className="mb-2">{rec.type}</Badge>
                      <h4 className="font-medium">{rec.title}</h4>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getImpactColor(rec.impact)}`}>
                        {rec.impact} Impact
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {rec.effort} Effort
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}