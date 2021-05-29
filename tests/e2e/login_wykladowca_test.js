Feature('login as lecturer');

Scenario('test something', ({ I }) => {
        I.amOnPage('http://localhost:3000/login');
        I.fillField('Login', 'onder');
        I.fillField('Hasło','onder');
        I.selectOption('form select','ROLE_LECTURER');
        I.click('Zaloguj');
	I.click('Wyloguj');
});
