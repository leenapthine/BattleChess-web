import { Router, Route } from '@solidjs/router';
import Index from '~/routes/index';

export default function App() {
  return (
    <Router>
      <Route path="/" component={Index} />
    </Router>
  );
}
