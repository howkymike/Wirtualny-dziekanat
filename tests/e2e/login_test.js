Feature('login');

Scenario('test something', ({ I }) => {
	I.amOnPage('http://localhost:3000/login');
	I.fillField('Login', 'kamil');
	I.fillField('Hasło','kamil');
	I.click('Zaloguj');
});
