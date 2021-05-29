Feature('logini as admin');

Scenario('test something', ({ I }) => {
        I.amOnPage('http://localhost:3000/login');
        I.fillField('Login', 'admin');
        I.fillField('Hasło','admin');
        I.selectOption('form select','ROLE_ADMIN');
        I.click('Zaloguj');
	I.click('Wyloguj');
});
