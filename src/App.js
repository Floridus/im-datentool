import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
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
// import BattleCalculator from './components/BattleCalculator/BattleCalculator';
import WorldChanger from './components/WorldChanger/WorldChanger';

const store = createStore(reducer);

function App() {
  const client = new ApolloClient({
    uri: config.API_URL,
  });

  return (
    <div className="root-area">
      <Provider store={store}>
        <Router>
          <ApolloProvider client={client}>
            <Navbar className="header-area">
              <Link to="/" className="navbar-brand">IM Datentool</Link>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Link to="/world" className="nav-link">Weltübersicht</Link>
                  <Link to="/ocean" className="nav-link">Ozeanübersicht</Link>
                  <Link to="/alliances" className="nav-link">Allianzen</Link>
                  <Link to="/players" className="nav-link">Spieler</Link>
                  <Link to="/changes" className="nav-link">Wechsel</Link>
                  {/*<Link to="/battle-calculator" className="nav-link">Kampfrechner</Link>*/}
                </Nav>
              </Navbar.Collapse>
              <WorldChanger />
            </Navbar>
            <div className="container p-0">
              <div className="inner-container">
                <AllyDataList />
                <Switch>
                  <Route path="/" exact><Home /></Route>
                  <Route path="/world" exact><WorldContainer /></Route>
                  <Route path="/ocean/:oce?" exact><OceanContainer /></Route>
                  <Route path="/alliances" exact><AllianceRankingContainer /></Route>
                  <Route path="/players" exact>
                    <div>Coming soon</div>
                  </Route>
                  <Route path="/changes" exact><ChangesContainer /></Route>
                  {/*<Route path="/battle-calculator" exact><BattleCalculator /></Route>*/}
                </Switch>
              </div>

              <div className="footer-area">
                <a href="https://www.insel-monarchie.de/" target="_blank">Insel-Monarchie</a>
                <span className="mx-2">||</span>
                <a href="https://forum.insel-monarchie.de/" target="_blank">Forum</a>
                <span className="mx-2">||</span>
                Made with <span className="heart">❤</span> in Austria by Floridus
              </div>
            </div>
          </ApolloProvider>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
