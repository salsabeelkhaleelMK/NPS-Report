import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import CampaignList from "@/pages/CampaignList";
import CampaignDetail from "@/pages/CampaignDetail";
import CreateCampaign from "@/pages/CreateCampaign";
import { LayoutDashboard, Megaphone, Settings, BarChart3, Users, Search, Bell, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Navigation items for sidebar
const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Megaphone, label: "Campaigns", path: "/campaigns" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Users, label: "Customers", path: "/customers" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full w-16 bg-sidebar flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-white font-bold text-lg">N</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = location.startsWith(item.path);
          const Icon = item.icon;
          
          return (
            <a
              key={item.path}
              href={item.path}
              className={`
                relative w-12 h-12 flex items-center justify-center rounded-lg transition-colors
                ${isActive 
                  ? "text-primary bg-sidebar-accent" 
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                }
              `}
              title={item.label}
            >
              {/* Active indicator - red border on left */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r" />
              )}
              <Icon className="h-5 w-5" />
            </a>
          );
        })}
      </nav>

      {/* User avatar at bottom */}
      <div className="mt-auto">
        <Avatar className="h-10 w-10 cursor-pointer">
          <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground text-sm">
            JD
          </AvatarFallback>
        </Avatar>
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <header className="fixed top-0 left-16 right-0 h-16 bg-white border-b border-border z-40 px-6 flex items-center justify-between">
      {/* Global Search */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          type="search"
          placeholder="Search campaigns, customers..."
          className="pl-10 bg-gray-50 border-gray-200 rounded-full h-10"
        />
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </button>

        {/* User Profile */}
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              JD
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-gray-900">John Doe</span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </header>
  );
}

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      <main className="ml-16 pt-16 min-h-screen">
        {children}
      </main>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <Redirect to="/campaigns" />
      </Route>
      <Route path="/campaigns" component={CampaignList} />
      <Route path="/campaigns/new" component={CreateCampaign} />
      <Route path="/campaigns/:id" component={CampaignDetail} />
      <Route path="/dashboard">
        <Redirect to="/campaigns" />
      </Route>
      <Route path="/analytics">
        <Redirect to="/campaigns" />
      </Route>
      <Route path="/customers">
        <Redirect to="/campaigns" />
      </Route>
      <Route path="/settings">
        <Redirect to="/campaigns" />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <MainLayout>
          <Router />
        </MainLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
