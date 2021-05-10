import React from 'react';

import Link from './Link';

const ClerkNav = () => {
    return(
        <>
            <Link to="/clerk">
                Podsumowanie
            </Link>
            <Link to="/clerk/courses">
                Zarządzaj kursami
            </Link>
            <Link to="/clerk/changeactualpassword">Zmien haslo</Link>
        </>
    )
}

export default ClerkNav;
