import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Prayer from "./pages/Prayer";
import Shine from "./pages/Shine";
import Wreckage from "./pages/Wreckage";
import Armory from "./pages/Armory";
import Nura from "./pages/Nura";
import Constitution from "./pages/Constitution";
import About from "./pages/About";
import ForgeLogin from "./pages/ForgeLogin";
import ForgeDashboard from "./pages/ForgeDashboard";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/prayer"} component={Prayer} />
      <Route path={"/shine"} component={Shine} />
      <Route path={"/wreckage"} component={Wreckage} />
      <Route path={"/armory"} component={Armory} />
      <Route path={"/nura"} component={Nura} />
      <Route path={"/constitution"} component={Constitution} />
      <Route path={"/about"} component={About} />
      <Route path={"/forge"} component={ForgeLogin} />
      <Route path={"/forge/dashboard"} component={ForgeDashboard} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
