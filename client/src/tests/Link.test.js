import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import Link from '../components/Link';

test('renders link', () => {
    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Link to="/">Link</Link>
        </Router>
    );

    const linkElement = screen.getByText(/Link/i);
    expect(linkElement).toBeInTheDocument();

    const a = linkElement.closest("a");
    expect(a).toHaveAttribute('href', '/');
});

test('renders another link', () => {
    const history = createMemoryHistory();
    render(
        <Router history={history}>
            <Link to="/about">About</Link>
        </Router>
    );

    const linkElement = screen.getByText(/About/i);
    expect(linkElement).toBeInTheDocument();

    const a = linkElement.closest("a");
    expect(a).toHaveAttribute('href', '/about');
});


test('link is selected when on page', () => {
    const history = createMemoryHistory();
    history.push("/about");

    render(
        <Router history={history}>
            <Link to="/">Link</Link>
            <Link to="/about">About</Link>
        </Router>
    );

    const linkElement = screen.getByText(/Link/i);
    expect(linkElement).toBeInTheDocument();

    const li = linkElement.closest("li");
    expect(li.selected).toBe(false);
    
    const aboutElement = screen.getByText(/About/i);
    expect(aboutElement).toBeInTheDocument();

    const li2 = aboutElement.closest("li");
    expect(li2.selected).toBe(true);

    history.push("/");

    expect(li2.selected).toBe(false);
    expect(li.selected).toBe(true);
});

