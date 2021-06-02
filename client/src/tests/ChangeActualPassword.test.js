import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { userContext } from '../context/userContext';
import ChangeActualPassword from '../pages/ChangeActualPassword';

let fetchApi = (address, params) => {
    return {ok: true, msg: "DD"};
}

let setHeader = (address) => {

}

test('renders form', () => {
    const history = createMemoryHistory()
    render(
        <userContext.Provider value={{fetchApi, setHeader}}>
            <Router history={history}>
                <ChangeActualPassword />
            </Router>
        </userContext.Provider>
    )


    const linkElement = screen.getByText(/Zmień aktualne hasło/i);
    expect(linkElement).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/Aktualne haslo/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Nowe hasło/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Wpisz ponownie hasło/i)).toBeInTheDocument();
});

test('test if password length is lesser than 5', () => {
    const history = createMemoryHistory()
    render(
        <userContext.Provider value={{fetchApi, setHeader}}>
            <Router history={history}>
                <ChangeActualPassword />
            </Router>
        </userContext.Provider>
    )

    const password = screen.getByPlaceholderText(/Nowe hasło/i);


    fireEvent.change(password, { target: { value: "123" }});
    
    expect(screen.getByText(/Hasło powinno zawierać przynajmniej 5 znaków/i)).toBeInTheDocument();

    fireEvent.change(password, { target: { value: "123456" }});
    
    expect(screen.queryByText(/Hasło powinno zawierać przynajmniej 5 znaków/i)).not.toBeInTheDocument();

    fireEvent.change(password, { target: { value: "123" }});
    
    expect(screen.queryByText(/Hasło powinno zawierać przynajmniej 5 znaków/i)).toBeInTheDocument();
});

test('test if password are diffrent', () => {
    const history = createMemoryHistory()
    render(
        <userContext.Provider value={{fetchApi, setHeader}}>
            <Router history={history}>
                <ChangeActualPassword />
            </Router>
        </userContext.Provider>
    )

    const password = screen.getByPlaceholderText(/Nowe hasło/i);
    const password2 = screen.getByPlaceholderText(/Wpisz ponownie hasło/i);

    fireEvent.change(password, { target: { value: "123456" }});
    fireEvent.change(password2, { target: { value: "1" }});


    expect(screen.getByText(/Hasła muszą być takie same/i)).toBeInTheDocument();

    fireEvent.change(password2, { target: { value: "123456" }});

    expect(screen.queryByText(/Hasła muszą być takie same/i)).not.toBeInTheDocument();

    fireEvent.change(password, { target: { value: "1234567" }});

    expect(screen.getByText(/Hasła muszą być takie same/i)).toBeInTheDocument();

    fireEvent.change(password2, { target: { value: "1234567" }});

    expect(screen.queryByText(/Hasła muszą być takie same/i)).not.toBeInTheDocument();
});

test('test show password function', () => {
    const history = createMemoryHistory()
    render(
        <userContext.Provider value={{fetchApi, setHeader}}>
            <Router history={history}>
                <ChangeActualPassword />
            </Router>
        </userContext.Provider>
    )

    const password = screen.getByPlaceholderText(/Aktualne haslo/i);

    expect(password.type).toBe("password");

    const sw = document.getElementsByClassName("input-group-text");
    const l = sw.item(0);

    fireEvent.mouseDown(l);
    
    expect(password.type).toBe("text");

    fireEvent.mouseUp(l);

    expect(password.type).toBe("password");
});
