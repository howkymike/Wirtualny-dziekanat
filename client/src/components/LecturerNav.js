import React from 'react';

import Link from './Link';

const LecturerNav = () => {
    return(
        <>
            <Link to="/lecturer">
                Podsumowanie
            </Link>

            <Link to="/lecturer/changeactualpassword">Zmien haslo</Link>
        </>
    )
}

export default LecturerNav;