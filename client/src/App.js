import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/Navbar';
import Planner from './pages/Planner';
import Dashboard from './pages/PassportBook';
import SearchParks from './pages/SearchParks'; 




const httpLink = createHttpLink({
    uri: '/graphql',
});


const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('id_token');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});


function App() {
    return (
        <ApolloProvider client={client}>
           <Navbar />
            <Router>
                <div className='content'>
                    <Routes>
                        <Route path='/dash' element={<Dashboard />} />
                        <Route path='/planner' element={<Planner />} />
                        <Route path='/parksearch' element={<SearchParks />} />
                    </Routes>
                </div>
            </Router>
        </ApolloProvider>
    );
}

export default App;
