import React from 'react';

import { faUserTie, faSkull, faExclamationTriangle, faKey } from '@fortawesome/free-solid-svg-icons'

import Link from '../Link';
import { Fa } from '../Nav';

const LecturerNav = () => {
    return(
        <>
            <Link to="/lecturer">
                <Fa icon={faUserTie} />
                Podsumowanie
            </Link>
            <Link to="/lecturer/course">
                <Fa icon={faSkull} />
                Kursy
            </Link>
            <Link to="/lecturer/reports">
                <Fa icon={faExclamationTriangle} />
                Zgłoszenia
            </Link>
            <Link to="/lecturer/changeactualpassword">
                <Fa icon={faKey} />
                Zmien haslo
            </Link>
        </>
    )
}

export default LecturerNav;
