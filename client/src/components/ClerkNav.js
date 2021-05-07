import React from 'react';

import Link from './Link';

const AdminNav = () => {
    return(
        <>
            <Link to="/clerk">
                Podsumowanie
            </Link>
            
            <Link to="/clerk/changeactualpassword">
                Zmien haslo
            </Link>
        </>
    )
}

export default AdminNav;