import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history';
import { userContext } from '../context/userContext';
import Nav from '../components/Nav';

const username = "Kamilek";
const logout = () => {};



test('renders nav', () => {
    const history = createMemoryHistory();
    const roles = ["ROLE_STUDENT"];
    render(
        <Router history={history}>
            <userContext.Provider value={{username, logout, roles}}>
                <Nav />
            </userContext.Provider>
        </Router>
    );

    const Element = screen.getByText(/Witaj, Kamilek/i);
    expect(Element).toBeInTheDocument();
});

test('renders student navbar', () => {
    const history = createMemoryHistory();
    const roles = ["ROLE_STUDENT"];
    render(
        <Router history={history}>
            <userContext.Provider value={{username, logout, roles}}>
                <Nav />
            </userContext.Provider>
        </Router>
    );

    const Element = screen.queryByText(/Platforma/i);

    expect(Element).not.toBeInTheDocument();

    const Element2 = screen.queryByText(/Podsumowanie/i);

    expect(Element2).toBeInTheDocument();
});

test('renders admin navbar', () => {
    const history = createMemoryHistory();
    const roles = ["ROLE_ADMIN"];
    render(
        <Router history={history}>
            <userContext.Provider value={{username, logout, roles}}>
                <Nav />
            </userContext.Provider>
        </Router>
    );

    const Element = screen.queryByText(/Platforma/i);

    expect(Element).toBeInTheDocument();

    const Element2 = screen.queryByText(/Podsumowanie/i);

    expect(Element2).toBeInTheDocument();
});