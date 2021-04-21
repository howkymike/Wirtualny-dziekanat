import React from 'react';

import Link from './Link';

const AdminNav = props => {
    return(
        <>
            <Link to="/admin">
                Podsumowanie
            </Link>
            <Link to="/admin/list">
                Użytkownicy
            </Link>
            <Link to="/admin/platform">
                Platforma
            </Link>
            <Link to="/admin/changeactualpassword">
                Zmien haslo
            </Link>
        </>
    )
}

export default AdminNav;