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
        </>
    )
}

export default AdminNav;