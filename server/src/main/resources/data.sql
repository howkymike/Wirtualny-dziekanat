INSERT INTO roles(name) VALUES('ROLE_ADMIN');
INSERT INTO roles(name) VALUES('ROLE_LECTURER');
INSERT INTO roles(name) VALUES('ROLE_STUFF');
INSERT INTO roles(name) VALUES('ROLE_STUDENT');

INSERT INTO users VALUES('1', 'wirtualnydziekan@gmail.com', false, '$2y$12$MsW/wkVDLxYRRPGSKfzvn.bVVfCB0h5WM7ib4zjjvR9WE/WTHeh6O', 'admin');
INSERT INTO user_roles VALUES('1','1');