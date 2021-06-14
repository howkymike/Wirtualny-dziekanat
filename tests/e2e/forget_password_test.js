Feature('forget_password');

Scenario('forget password', ({ I }) => {
        I.amOnPage('http://localhost:3000/login');
        I.click('Zapomiałem hasła');
	I.see('Zapomiałeś hasła?');
	I.fillField('Login','kamil');
	I.click('Wyślij');
	I.wait(2);
	I.see('Link do zmiany hasła został wysłany.');
	I.fillField('Login','SvenRauchaDaewida');
	I.click('Wyślij');
	I.wait(2);
	I.see('Uzytkownik o podanej nazwie nie istnieje.');
	I.click('Powrót do logowania');
});
