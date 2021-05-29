Feature('login as dean worker');

Scenario('test something', ({ I }) => {
        I.amOnPage('http://localhost:3000/login');
        I.fillField('Login', 'baba');
        I.fillField('Hasło','baba');
        I.selectOption('form select','ROLE_CLERK');
        I.click('Zaloguj');
	I.click('Wyloguj');
});
