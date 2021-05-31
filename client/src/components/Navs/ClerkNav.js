import React from 'react';

import { faUserEdit, faTasks, faUserGraduate, faKey } from '@fortawesome/free-solid-svg-icons'

import Link from '../Link';
import { Fa } from '../Nav';

const ClerkNav = () => {
    return(
        <>
            <Link to="/clerk">
                <Fa icon={faUserEdit} />
                Podsumowanie
            </Link>
            <Link to="/clerk/courses">
                <Fa icon={faTasks} />
                Zarządzaj kursami
            </Link>
            <Link to="/clerk/students">
                <Fa icon={faUserGraduate} />
                Studenci
            </Link>
            <Link to="/clerk/changeactualpassword">
                <Fa icon={faKey} />
                Zmien haslo
            </Link>
        </>
    )
}

export default ClerkNav;
