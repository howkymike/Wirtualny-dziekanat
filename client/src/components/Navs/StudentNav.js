import React from 'react';

import { faUserGraduate, faListAlt, faPray, faKey } from '@fortawesome/free-solid-svg-icons'

import Link from '../Link';
import { Fa } from '../Nav';

const AdminNav = () => {
    return(
        <>
            <Link to="/student">
                <Fa icon={faUserGraduate} />
                Podsumowanie
            </Link>
            <Link to="/student/course-of-studies">
                <Fa icon={faListAlt} />
                Przebieg Studiów
            </Link>
            <Link to="/student/course">
                <Fa icon={faPray} />
                Kursy
            </Link>
            <Link to="/student/changeactualpassword">
                <Fa icon={faKey} />
                Zmień hasło
            </Link>
        </>
    )
}

export default AdminNav;