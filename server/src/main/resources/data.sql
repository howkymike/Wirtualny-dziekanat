INSERT INTO roles(name) VALUES('ROLE_ADMIN');
INSERT INTO roles(name) VALUES('ROLE_LECTURER');
INSERT INTO roles(name) VALUES('ROLE_STUFF');
INSERT INTO roles(name) VALUES('ROLE_STUDENT');

INSERT INTO users VALUES('1', 'admin@agh.pl', 0, false, '$2y$12$MsW/wkVDLxYRRPGSKfzvn.bVVfCB0h5WM7ib4zjjvR9WE/WTHeh6O', 'admin');
INSERT INTO user_roles VALUES('1','1');

INSERT INTO users VALUES('2', 'joe@agh.pl', 0, false, '$2y$12$GfzlLxAS7C.pfwxwyF6mj.ezwFGHWKecjSja/FUndpmdYfOvau9.u', 'joedoe');
INSERT INTO user_roles VALUES('2','4');