# Wirtualny-dziekanat
Aplikacja sieciowa kierowana do kadry dydaktycznej, pracowników Uczelni i studentów, która ułatwia kontakt między pracownikami dziekanatu, wykładowcami i studentami oraz umożliwia sprawne zarządzanie procesem dydaktycznym Uczelni.

### Przydatne komendy
Uruchomienie wszystkiego: 
````
    docker-compose up
````
Gdyby wystąpiły problemy z React to trzeba wejśc do "client" i wykonać komendę `npm install`

Warto testować w trybie **Incognito**


Zrzut bazy danych:
````
    ./dump.sh
````
Przywrócenie bazy danych:
````
    ./restore.sh
````
