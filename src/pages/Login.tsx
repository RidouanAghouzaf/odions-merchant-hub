// src/pages/Login.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/auth/AuthProvider";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, user, isAuthenticated } = useAuth();

  // If user is already logged in, redirect them to their dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") navigate("/users", { replace: true });
      else navigate("/orders", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const loggedUser = await login(formData.email, formData.password); // uses AuthProvider.login
      setIsLoading(false);

      toast({
        title: "Login successful",
        description: `Welcome back, ${loggedUser.role}!`,
      });

      // redirect to where the user initially wanted to go, if any
      const state = (location.state as any) || {};
      const from = state.from?.pathname;

      if (from) {
        navigate(from);
        return;
      }

      // otherwise go by role
      if (loggedUser.role === "admin") navigate("/users");
      else navigate("/orders");
    } catch (err: any) {
      setIsLoading(false);
      toast({
        title: "Login failed",
        description: err?.message || "Please check your credentials",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 animate-float">
            <span className="text-white font-bold text-2xl">O</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">ODIONS</h1>
          <p className="text-muted-foreground">E-commerce Management Platform</p>
        </div>

        <Card className="glass border-card-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your account to access your dashboard</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, rememberMe: checked as boolean }))}
                  />
                  <Label htmlFor="rememberMe" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <button type="button" className="text-sm text-primary hover:underline" onClick={() => toast({ title: "Password reset link sent to your email" })}>
                  Forgot password?
                </button>
              </div>

              <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 h-11" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="text-center mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button onClick={() => navigate("/register")} className="text-primary hover:underline font-medium">
                  Sign up here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4 bg-muted/50 border-dashed">
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Demo:</strong> admin@demo.com • password123
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
