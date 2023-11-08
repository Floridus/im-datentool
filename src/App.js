import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import './App.scss';

import reducer from './redux/reducer';
import config from './config/index';

import Home from './components/Home/Home';
import WorldContainer from './containers/World/World';
import AllyDataList from './containers/AllyDataList/AllyDataList';
import OceanContainer from './containers/Ocean/Ocean';
import ChangesContainer from './containers/Changes/Changes';
import AllianceRankingContainer from './containers/AllianceRanking/AllianceRanking';
import BattleCalculator from './components/BattleCalculator/BattleCalculator';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import PlayerRankingContainer from './containers/PlayerRanking/PlayerRanking';
import TotalViewContainer from './containers/TotalView/TotalView';

const store = createStore(reducer);

function App() {
  const link = new HttpLink({ uri: config.API_URL });
  const cache = new InMemoryCache();

  const client = new ApolloClient({
    link,
    cache,
  });

  return (
    <div className="root-area">
      <Provider store={store}>
        <Router>
          <ApolloProvider client={client}>
            <Header />
            <div className="container p-0">
              <div className="inner-container">
                <AllyDataList />
                <Switch>
                  <Route path="/" exact><Home /></Route>
                  <Route path="/world" exact><WorldContainer /></Route>
                  <Route path="/ocean/:oce?" exact><OceanContainer /></Route>
                  <Route path="/alliances" exact><AllianceRankingContainer /></Route>
                  <Route path="/players" exact><PlayerRankingContainer /></Route>
                  <Route path="/changes" exact><ChangesContainer /></Route>
                  <Route path="/battle-calculator" exact><BattleCalculator /></Route>
                  <Route path="/total-view" exact><TotalViewContainer /></Route>
                </Switch>
              </div>

              <Footer />
            </div>
          </ApolloProvider>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
