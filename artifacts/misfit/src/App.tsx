import { Router, Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home.js';
import Prayer from './pages/Prayer.js';
import Shine from './pages/Shine.js';
import Wreckage from './pages/Wreckage.js';
import Armory from './pages/Armory.js';
import Nura from './pages/Nura.js';
import About from './pages/About.js';
import Constitution from './pages/Constitution.js';
import Forge from './pages/Forge.js';
import Store from './pages/Store.js';
import NotFound from './pages/NotFound.js';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/prayer" component={Prayer} />
          <Route path="/shine" component={Shine} />
          <Route path="/wreckage" component={Wreckage} />
          <Route path="/armory" component={Armory} />
          <Route path="/nura" component={Nura} />
          <Route path="/about" component={About} />
          <Route path="/constitution" component={Constitution} />
          <Route path="/forge" component={Forge} />
          <Route path="/store" component={Store} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </QueryClientProvider>
  );
}
