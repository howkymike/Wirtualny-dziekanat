import React, { useContext, useEffect, useState } from 'react';
import { userContext} from '../context/userContext';
import { Table, Alert } from 'reactstrap';
import { Wrapper } from './StudentList';

const Summary = ({type}) => {

    let [user, setUser] = useState({});
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState([false, ""]);

    const { fetchApi } = useContext(userContext);

    useEffect(() => {

        const getUser = async () => {
            const [result, isOk] = await fetchApi(`/users/${type}/me`);

            if(isOk) {
                setUser(result);
                setLoading(false);
            } else
                setError([true, "Błąd"]);
        }

        getUser();

    }, [fetchApi, type]);

    return(
        <Wrapper>
            <h4>Podsumowanie</h4>
            <hr />
            <Table>
                <thead>
                    <tr>
                        <th colSpan="2">Dane kontaktowe</th>
                    </tr>
                </thead>
                <tbody>
                    {   loading ?
                        <tr><td colSpan="2">Ładowanie</td></tr>
                        :
                        <>
                            <tr>
                                <th scope="row">Imię</th>
                                <td>{ user.name }</td>
                            </tr>
                            <tr>
                                <th scope="row">Nazwisko</th>
                                <td>{ user.surname }</td>
                            </tr>
                            <tr>
                                <th scope="row">Email</th>
                                <td>{ user.email }</td>
                            </tr>
                            <tr>
                                <th scope="row">Państwo</th>
                                <td>{ user.country }</td>
                            </tr>
                            <tr>
                                <th scope="row">Miasto</th>
                                <td>{ user.city }</td>
                            </tr>
                            <tr>
                                <th scope="row">Adres</th>
                                <td>{ user.address }</td>
                            </tr>
                            <tr>
                                <th scope="row">Kod-pocztowy</th>
                                <td>{ user.postalCode }</td>
                            </tr>
                            <tr>
                                <th scope="row">Telefon</th>
                                <td>{ user.telephone }</td>
                            </tr>
                        </>
                    }
                </tbody>
            </Table>
            {
                error[0] && <Alert color={"danger"}>{error[1]}</Alert>
            }
            
        </Wrapper>
    );
}

export default Summary;