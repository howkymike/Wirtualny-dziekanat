import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'

import Login from "../pages/Login";
import { userContext } from '../context/userContext';

const login = (username, password) => {
    throw new Error("Wrong credentials.");

}

test('renders form', () => {
    const history = createMemoryHistory();

    render(
        <userContext.Provider value={login}>
            <Router history={history}>
                <Login />
            </Router>
        </userContext.Provider>
    );

    expect(screen.getByText("Zapomiałem hasła")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Login")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Hasło")).toBeInTheDocument();
    expect(screen.getByText("Zaloguj")).toBeInTheDocument();
});

test('test if login and password is empty', () => {
    const history = createMemoryHistory();

    render(
        <userContext.Provider value={login}>
            <Router history={history}>
                <Login />
            </Router>
        </userContext.Provider>
    );
    
    const loginBtn = screen.getByText("Zaloguj");

    expect(history.location.pathname).toEqual('/');

    fireEvent.click(loginBtn);
    
    expect(history.location.pathname).toEqual('/');
    expect(screen.getByText("Podaj swój login.")).toBeVisible();
    expect(screen.getByText("Wpisz hasło.")).toBeVisible();
});

test('test if invalid password or login', async () => {
    const history = createMemoryHistory();

    const login = () => {
        throw new Error("Wrong credentials.");
    };

    render(
        <userContext.Provider value={{login}}>
            <Router history={history}>
                <Login />
            </Router>
        </userContext.Provider>
    );

    const loginBtn = screen.getByText("Zaloguj");
    const loginInput = screen.getByPlaceholderText("Login");
    const passwdInput = screen.getByPlaceholderText("Hasło");
    
    fireEvent.change(loginInput, {target: {value: "andrzej"}});
    fireEvent.change(passwdInput, {target: {value: "kabanosik1234"}});
    
    expect(screen.queryByText(/Wrong credentials\./i)).not.toBeInTheDocument();
    fireEvent.click(loginBtn);
    expect(await screen.findByText(/Wrong credentials\./i)).toBeInTheDocument();
});

test('test if password and login is valid', async () => {
    const history = createMemoryHistory();

    const roles = ['ROLE_ADMIN'];

    const login = () => {
        return true;
    };

    render(
        <userContext.Provider value={{login, roles}}>
            <Router history={history}>
                <Login />
            </Router>
        </userContext.Provider>
    );

    const loginBtn = screen.getByText("Zaloguj");
    const loginInput = screen.getByPlaceholderText("Login");
    const passwdInput = screen.getByPlaceholderText("Hasło");
    
    fireEvent.change(loginInput, {target: {value: "andrzej"}});
    fireEvent.change(passwdInput, {target: {value: "kabanosik1234"}});
    
    expect(history.location.pathname).toBe('/');
    await fireEvent.click(loginBtn);
    expect(history.location.pathname).toEqual('/admin');
});

const setHeader = (address) => {

}

test('test if user is logged', () => {
    const history = createMemoryHistory();
    const roles = ['ROLE_ADMIN'];

    render(
        <userContext.Provider value={{roles, logged: true, setHeader}}>
            <Router history={history}>
                <Login />
            </Router>
        </userContext.Provider>
    );

    expect(history.location.pathname).toBe('/admin');
})

test('test forgot password link', () => {

    const history = createMemoryHistory();

    render(
        <userContext.Provider value={login, setHeader}>
            <Router history={history}>
                <Login />
            </Router>
        </userContext.Provider>
    );

    const forgotPasswdLink = screen.getByText("Zapomiałem hasła");
    
    expect(history.location.pathname).toBe('/');
    fireEvent.click(forgotPasswdLink);
    expect(history.location.pathname).toBe('/forgetPassword');
});
