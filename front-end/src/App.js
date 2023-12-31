import { Route, Switch } from 'react-router-dom';
import initialPage from './page/initialPage';
import skambooks from './page/skambooks';
import createUser from './page/createUser';
import searcheBooks from './page/searcheBooks';
import exchanges from './page/exchanges';
import updateBook from './page/updateBook';
import createBook from './page/createBook';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={ initialPage } />
        <Route exact path="/skambooks" component={ skambooks } />
        <Route exact path="/create-user" component={ createUser } />
        <Route exact path='/search' component={ searcheBooks } />
        <Route exact path='/exchange' component={ exchanges } />
        <Route exact path='/update-book' component={ updateBook } />
        <Route exact path='/create-book' component={ createBook } />
      </Switch>
    </div>
  );
}

export default App;
