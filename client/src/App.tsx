import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import CampaignList from "@/pages/CampaignList";
import CampaignDetail from "@/pages/CampaignDetail";
import CreateCampaign from "@/pages/CreateCampaign";

function Router() {
  return (
    <Switch>
      <Route path="/">
        <Redirect to="/campaigns" />
      </Route>
      <Route path="/campaigns" component={CampaignList} />
      <Route path="/campaigns/new" component={CreateCampaign} />
      <Route path="/campaigns/:id" component={CampaignDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
