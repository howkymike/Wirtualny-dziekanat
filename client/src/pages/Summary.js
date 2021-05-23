import React, { useContext, useEffect, useReducer } from 'react';
import { Table, Alert } from 'reactstrap';
import styled from 'styled-components';
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import { userContext } from '../context/userContext';
import { Wrapper } from './StudentList';

import GradientButton from '../components/GradientButton';
import Editable from '../components/Editable';
import ErrorBox from '../components/Error';

const initialState = {
    user: {}, loading: true, error: [false, ""], edit: false, email: "",
    country: "", city: "", address: "", postalCode: "", telephone: ""
}

const reducer = (state, {type, payload}) => {
    switch(type) {
        case "country": case "city": case "address":
        case "postalCode": case "telephone": case "email":
            return { ...state, [type]: payload }
        case "edit":
            return { ...state, edit: !state.loading && !state.edit}
        case "user":
            return {
                ...state,
                user: payload, loading: false, email: payload.email,
                country: payload.country, city: payload.city, address: payload.address,
                postalCode: payload.postalCode, telephone: payload.telephone
            }
        case "error":
            if(typeof payload == "object")
                return { ...state, error: [true, payload.error] }
            else
                return { ...state, error: [true, payload] }
        case "update":
            return { ...state, edit: false, user: {
                ...state.user, email: state.email, country: state.country,
                city: state.city, address: state.address, telephone: state.telephone,
                postalCode: state.postalCode
            }}
        case "resetError":
            return { ...state, error: [false, ""] }
        default:
            return state;
    }
}   

const names = ["Email", "Państwo", "Miasto", "Adres", "Kod pocztowy", "Telefon"];

const Td = styled.td` 
    height: 3em;
    line-height: 3em;
    width: 50%;
`;

const Th = styled.th` 
    height: 3rem;
    line-height: 3rem;
    width: 50%;
`;

const Thead = styled.th` 
    position: relative;
`;

const FaEdit = styled(Fa)`
    position: absolute;
    right: 1em;
    top: 0.5em;
    cursor: pointer;
`;

const Summary = ({ type }) => {

    const { fetchApi } = useContext(userContext);
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {

        const getUser = async () => {
            try {
                const [result, isOk] = await fetchApi(`/users/${type}/me`);

                if(isOk) {
                    dispatch({ type: "user", payload: result });
                } else
                    dispatch({ type: "error", payload: "Wystąpił błąd, spróbuj ponownie" });
            } catch(e) {
                //console.log(e);
                dispatch({ type: "error", payload: "Wystąpił błąd, spróbuj ponownie" });
            }
        }

        getUser();

    }, [fetchApi, type]);

    const updateData = async () => {
        try {
            if(state.error[0])
                return;
            const { email, country, city, address, postalCode, telephone } = state;

            const [result, isOk] = await fetchApi("/users/update", {
                method: "PATCH",
                body: JSON.stringify({
                    email, country, city, address, postalCode, telephone
                })
            });

            if(isOk) {
                dispatch({ type: "update" });
            } else
                dispatch({ type: "error", payload: "Wystąpił błąd przy aktualizacji danych" });
        } catch(e) {
            //console.log(e);
            dispatch({ type: "error", payload: "Wystąpił błąd przy aktualizacji danych" });
        }
    }

    useEffect(() => {
        if(state.edit && (!state.email?.length || !state.country?.length || !state.city?.length || !state.address?.length ||
            !state.telephone?.length || !state.postalCode?.length))
            dispatch({ type: "error", payload: "Uzupełnij wszystkie pola" });
        else
            dispatch({ type: "resetError" });

    }, [state.email, state.country, state.city, state.address, state.telephone, state.postalCode, state.edit]);


    return(
        <Wrapper>
            <h4>Podsumowanie</h4>
            <hr />
            <Table hover striped>
                <thead>
                    <tr>
                        <Thead colSpan="2">
                            <span>Dane kontaktowe</span>
                            <FaEdit icon={ faEdit } size="lg" onClick={ () => dispatch({ type: "edit" })} />
                        </Thead>
                    </tr>
                </thead>
                <tbody>
                    {   state.loading ?
                        <tr><td colSpan="2">Ładowanie</td></tr>
                        :
                        <>
                            <tr>
                                <Th scope="row">Imię</Th>
                                <Td>{ state.user.name }</Td>
                            </tr>
                            <tr>
                                <Th scope="row">Nazwisko</Th>
                                <Td>{ state.user.surname }</Td>
                            </tr>
                            { ["email", "country", "city", "address", "postalCode", "telephone"].map((value, key) => (
                                <tr key={ key }>
                                    <Th scope="row">{names[key]}</Th>
                                    <Td>
                                        <Editable 
                                            value={ state.edit ? state[value] : state.user[value] } editable={ state.edit }
                                            onChange={ e => dispatch({type: value, payload: e.target.value })}
                                        />
                                    </Td>
                                </tr>
                            )) }
                        </>
                    }
                </tbody>
            </Table>
            {
                state.edit && <GradientButton onClick={updateData}>Zaaktualizuj dane</GradientButton>
            }
            <ErrorBox error={ state.error } />            
        </Wrapper>
    );
}

export default Summary;