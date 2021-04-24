import React from 'react';

import Link from './Link';

const AdminNav = props => {
    return(
        <>
            <Link to="/student">
                Podsumowanie
            </Link>
            <Link to="/student/changeactualpassword">Zmien haslo</Link>
        </>
    )
}

export default AdminNav;