INSERT INTO roles(name) VALUES('ROLE_ADMIN');
INSERT INTO roles(name) VALUES('ROLE_LECTURER');
INSERT INTO roles(name) VALUES('ROLE_STUFF');
INSERT INTO roles(name) VALUES('ROLE_STUDENT');

INSERT INTO faculties VALUES(1, 'WGGIOŚ');

INSERT INTO users(id, email, is_new, password, username, name, surname) 
    VALUES('1', 'wirtualnydziekan@gmail.com', false, '$2y$12$MsW/wkVDLxYRRPGSKfzvn.bVVfCB0h5WM7ib4zjjvR9WE/WTHeh6O', 'admin', 'Admin', 'AdminKEK'),
    ('2', 'wirtualnydziekan2@gmail.com', false, '$2y$12$MsW/wkVDLxYRRPGSKfzvn.bVVfCB0h5WM7ib4zjjvR9WE/WTHeh6O', 'kamil', 'Kamil', 'Wiercik'),
    ('3', 'wirtualnydziekan3@gmail.com', false, '$2y$12$MsW/wkVDLxYRRPGSKfzvn.bVVfCB0h5WM7ib4zjjvR9WE/WTHeh6O', 'baba', 'Baba', 'Z dziekanatu'),
    ('4', 'wirtualnydziekan4@gmail.com', false, '$2y$12$MsW/wkVDLxYRRPGSKfzvn.bVVfCB0h5WM7ib4zjjvR9WE/WTHeh6O', 'onder', 'Zdzisław', 'Onderka');

INSERT INTO students VALUES(2, 304357);
INSERT INTO professors VALUES(4, 'dr', 1);
INSERT INTO clerks VALUES(3, 1);


INSERT INTO user_roles VALUES('1','1');
INSERT INTO user_roles VALUES('2','4');
INSERT INTO user_roles VALUES('3','3');
INSERT INTO user_roles VALUES('4','2');