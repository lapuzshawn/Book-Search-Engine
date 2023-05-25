import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});


function App() {
  return (
    // Provides the Apollo Client instance
    <ApolloProvider client={client}>
      <Router>
        <>
          {/* Renders Navbar component */}
          <Navbar />

          {/* Sets up routs */}
          <Routes>
            <Route path='/' element={<SearchBooks />} /> {/* Render the SearchBooks component */}
            <Route path='/saved' element={<SavedBooks />} /> {/* Render the SavedBooks component */}
            <Route path='*' element={<h1 className='display-2'>Wrong page!</h1>} /> {/* Render a default error message for wrong page */}
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
