import React, { useState } from "react";
import { Bot, Play, Pause, Settings, Edit, Plus, MessageSquare, Users, BarChart3, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export default function Chatbots() {
  const [isMainBotEnabled, setIsMainBotEnabled] = useState(true);
  const [isFlowBuilderOpen, setIsFlowBuilderOpen] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState<any>(null);

  const botStats = {
    totalConversations: 1247,
    activeConversations: 23,
    resolutionRate: 87.5,
    avgResponseTime: 1.2,
    satisfactionScore: 4.3
  };

  const conversationFlows = [
    {
      id: "1",
      name: "Welcome & FAQ",
      description: "Greets new visitors and handles common questions",
      isActive: true,
      triggers: ["Hello", "Hi", "Help", "FAQ"],
      responses: 892,
      successRate: 94.2
    },
    {
      id: "2",
      name: "Order Support",
      description: "Helps customers track and manage their orders",
      isActive: true,
      triggers: ["Order", "Track", "Shipping", "Delivery"],
      responses: 634,
      successRate: 89.1
    },
    {
      id: "3",
      name: "Product Recommendations",
      description: "Suggests products based on customer preferences",
      isActive: false,
      triggers: ["Recommend", "Suggest", "Similar", "Best"],
      responses: 234,
      successRate: 76.8
    },
    {
      id: "4",
      name: "Returns & Refunds",
      description: "Guides customers through return process",
      isActive: true,
      triggers: ["Return", "Refund", "Exchange", "Cancel"],
      responses: 156,
      successRate: 91.7
    }
  ];

  const recentConversations = [
    {
      id: "1",
      customer: "Alice Johnson",
      message: "Hi! I need help tracking my order #12345",
      timestamp: "2 minutes ago",
      status: "resolved",
      flow: "Order Support"
    },
    {
      id: "2",
      customer: "Bob Smith",
      message: "What's your return policy?",
      timestamp: "5 minutes ago",
      status: "active",
      flow: "Returns & Refunds"
    },
    {
      id: "3",
      customer: "Carol Brown",
      message: "Can you recommend similar products?",
      timestamp: "12 minutes ago",
      status: "escalated",
      flow: "Product Recommendations"
    },
    {
      id: "4",
      customer: "David Wilson",
      message: "Hello, I'm new here. How does this work?",
      timestamp: "18 minutes ago",
      status: "resolved",
      flow: "Welcome & FAQ"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      resolved: { variant: "default" as const, className: "status-success" },
      active: { variant: "secondary" as const, className: "status-warning animate-pulse" },
      escalated: { variant: "destructive" as const, className: "status-destructive" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleEditFlow = (flow: any) => {
    setSelectedFlow(flow);
    setIsFlowBuilderOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Chatbot Management</h1>
          <p className="text-muted-foreground">Configure and monitor your AI customer support assistant</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
            <div className={`w-2 h-2 rounded-full ${isMainBotEnabled ? 'bg-success animate-pulse' : 'bg-destructive'}`} />
            <span className="text-sm font-medium">
              {isMainBotEnabled ? 'Online' : 'Offline'}
            </span>
          </div>
          
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Bot Settings
          </Button>
          
          <Dialog open={isFlowBuilderOpen} onOpenChange={setIsFlowBuilderOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Create Flow
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{selectedFlow ? 'Edit' : 'Create'} Conversation Flow</DialogTitle>
                <DialogDescription>
                  {selectedFlow ? 'Modify an existing' : 'Set up a new'} automated conversation flow for your chatbot.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="flowName">Flow Name</Label>
                  <Input 
                    id="flowName" 
                    placeholder="e.g., Order Support" 
                    defaultValue={selectedFlow?.name}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="flowDescription">Description</Label>
                  <Input 
                    id="flowDescription" 
                    placeholder="Brief description of what this flow does"
                    defaultValue={selectedFlow?.description}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="triggers">Trigger Keywords</Label>
                  <Input 
                    id="triggers" 
                    placeholder="hello, hi, help, support (comma separated)"
                    defaultValue={selectedFlow?.triggers?.join(', ')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="initialMessage">Initial Bot Message</Label>
                  <Textarea 
                    id="initialMessage" 
                    placeholder="Hi! I'm here to help you with your orders. What can I assist you with today?"
                    defaultValue="Hi! How can I help you today?"
                  />
                </div>
                
                <div className="space-y-4">
                  <Label>Conversation Steps</Label>
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">1</div>
                      <div className="flex-1">
                        <Input placeholder="Bot response or question" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">2</div>
                      <div className="flex-1">
                        <Input placeholder="Follow-up response" />
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Step
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsFlowBuilderOpen(false);
                  setSelectedFlow(null);
                }}>
                  Cancel
                </Button>
                <Button className="bg-gradient-primary hover:opacity-90">
                  {selectedFlow ? 'Update' : 'Create'} Flow
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Bot Status & Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Main Chatbot
              </CardTitle>
              <CardDescription>AI-powered customer support assistant</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">{isMainBotEnabled ? 'Active' : 'Inactive'}</p>
              </div>
              <Switch
                checked={isMainBotEnabled}
                onCheckedChange={setIsMainBotEnabled}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{botStats.totalConversations}</div>
              <p className="text-sm text-muted-foreground">Total Conversations</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{botStats.activeConversations}</div>
              <p className="text-sm text-muted-foreground">Active Now</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{botStats.resolutionRate}%</div>
              <p className="text-sm text-muted-foreground">Resolution Rate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{botStats.avgResponseTime}s</div>
              <p className="text-sm text-muted-foreground">Avg Response</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{botStats.satisfactionScore}/5</div>
              <p className="text-sm text-muted-foreground">Satisfaction</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversation Flows */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Conversation Flows</CardTitle>
              <CardDescription>Manage automated conversation paths and responses</CardDescription>
            </div>
            <Button size="sm" onClick={() => setIsFlowBuilderOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Flow
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversationFlows.map((flow) => (
              <div key={flow.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{flow.name}</h3>
                      <Badge variant={flow.isActive ? "default" : "secondary"}>
                        {flow.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{flow.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {flow.triggers.map((trigger, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {trigger}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditFlow(flow)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Switch checked={flow.isActive} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Responses: </span>
                    <span className="font-medium">{flow.responses}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Success Rate: </span>
                    <span className="font-medium text-success">{flow.successRate}%</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <Progress value={flow.successRate} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Conversations & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Conversations</CardTitle>
            <CardDescription>Latest customer interactions with the chatbot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentConversations.map((conversation) => (
                <div key={conversation.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{conversation.customer}</p>
                      {getStatusBadge(conversation.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 truncate">
                      "{conversation.message}"
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{conversation.timestamp}</span>
                      <span>Flow: {conversation.flow}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Analytics</CardTitle>
            <CardDescription>Chatbot effectiveness metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Response Time</span>
                <span className="font-medium">{botStats.avgResponseTime}s avg</span>
              </div>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Target: &lt;2s</p>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Resolution Rate</span>
                <span className="font-medium text-success">{botStats.resolutionRate}%</span>
              </div>
              <Progress value={botStats.resolutionRate} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Target: &gt;80%</p>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
                <span className="font-medium text-success">{botStats.satisfactionScore}/5.0</span>
              </div>
              <Progress value={(botStats.satisfactionScore / 5) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Based on 234 ratings</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">156</div>
                <p className="text-muted-foreground">Escalations</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-success">1,091</div>
                <p className="text-muted-foreground">Self-Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}