import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DetailedChartsPage from './pages/DetailedChartsPage';
import HistoricalDataPage from './pages/HistoricalDataPage';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/charts" component={DetailedChartsPage} />
        <Route path="/history" component={HistoricalDataPage} />
      </Switch>
    </Router>
  );
};

export default App;
