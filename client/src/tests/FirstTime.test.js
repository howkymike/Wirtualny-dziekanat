import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { userContext } from '../context/userContext';
import FirstTime from '../pages/FirstTime';

let fetchApi = (address, params) => {
    return {ok: true, msg: "DD"};
}


test('renders form', () => {
    const history = createMemoryHistory()
    render(
        <userContext.Provider value={fetchApi}>
        <Router history={history}>
            <FirstTime />
        </Router>
        </userContext.Provider>
    )


    const linkElement = screen.getByText(/Ustaw hasło/i);
    expect(linkElement).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/Nowe hasło/i)).toBeInTheDocument();
});
  

test('test if password length is lesser than 5', () => {
    const history = createMemoryHistory()
    render(
        <userContext.Provider value={fetchApi}>
        <Router history={history}>
            <FirstTime />
        </Router>
        </userContext.Provider>
    )

    const password = screen.getByPlaceholderText(/Nowe hasło/i);

    //const password2 = screen.getByPlaceholderText(/Wpisz ponowie hasło/i);

    fireEvent.change(password, { target: { value: "123" }});
    
    expect(screen.getByText(/Minimalna długość hasła to 5/i)).toBeInTheDocument();

    fireEvent.change(password, { target: { value: "123456" }});
    
    expect(screen.queryByText(/Minimalna długość hasła to 5/i)).not.toBeInTheDocument();

    fireEvent.change(password, { target: { value: "123" }});
    
    expect(screen.queryByText(/Minimalna długość hasła to 5/i)).toBeInTheDocument();
});

test('test if password are diffrent', () => {
    const history = createMemoryHistory()
    render(
        <userContext.Provider value={fetchApi}>
        <Router history={history}>
            <FirstTime />
        </Router>
        </userContext.Provider>
    )

    const password = screen.getByPlaceholderText(/Nowe hasło/i);

    const password2 = screen.getByPlaceholderText(/Wpisz ponowie hasło/i);

    fireEvent.change(password, { target: { value: "123456" }});

    expect(screen.getByText(/Hasła są różne/i)).toBeInTheDocument();

    fireEvent.change(password2, { target: { value: "123456" }});

    expect(screen.queryByText(/Hasła są różne/i)).not.toBeInTheDocument();

    fireEvent.change(password, { target: { value: "1234567" }});

    expect(screen.getByText(/Hasła są różne/i)).toBeInTheDocument();

    fireEvent.change(password2, { target: { value: "1234567" }});

    expect(screen.queryByText(/Hasła są różne/i)).not.toBeInTheDocument();
});