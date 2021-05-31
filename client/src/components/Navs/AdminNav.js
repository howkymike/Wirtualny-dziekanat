import React from 'react';

import { faUserSecret, faUserFriends, faCogs, faKey } from '@fortawesome/free-solid-svg-icons'

import Link from '../Link';
import { Fa } from '../Nav';

const AdminNav = () => {
    return(
        <>
            <Link to="/admin">
                <Fa icon={faUserSecret} />
                Podsumowanie
            </Link>
            <Link to="/admin/list">
                <Fa icon={faUserFriends} />
                Użytkownicy
            </Link>
            <Link to="/admin/platform">
                <Fa icon={faCogs} />
                Platforma
            </Link>
            <Link to="/admin/changeactualpassword">
                <Fa icon={faKey} />
                Zmien haslo
            </Link>
        </>
    )
}

export default AdminNav;