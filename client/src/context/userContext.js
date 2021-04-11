import React, { useState, useEffect, createContext } from 'react';
import { useHistory } from 'react-router-dom';
// @ts-ignore
export const userContext = createContext();
export const api = "http://localhost:8080/api";

const UserProvider = ({children}) => {

    let [logged, setLogged] = useState(false);
    let [token, setToken] = useState(null);
    let [username, setUsername] = useState("");
    let [roles, setRoles] = useState([]);

    const history = useHistory();

    const setLogin = ({token, username, roles}) => {
        setToken(token);
        setUsername(username);
        setRoles(roles);
        setLogged(true);
    }

    /**
     * Get jwt token, set in context, return true when 
     *
     * @param {string} username The number to raise.
     * @param {string} password The power, must be a natural number.
     * @return {Promise<boolean>} true if success
    */
    const login = async (username, password) => {
        const result = await fetch(api + "/auth/login", {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify({
                username, password
            })
        }); 

        const json = await result.json();

        if(!result.ok) {
            if(json.error === "Unauthorized")
                throw new Error("Wrong credentials");

            throw new Error("Can't login");
        }

        setLogin(json);

        localStorage.setItem("token", json.token);
        localStorage.setItem("username", json.username);
        localStorage.setItem("roles", JSON.stringify(json.roles));

        return true;
    }

    const fetchApi = async (/** @type {RequestInfo} */ address, /** @type {RequestInit | undefined} */ init) => {
        const result = await fetch(api + address, {
            headers: {
                'Content-Type': "application/json",
                'Authorization': "Bearer " + token,
                ...init?.headers
            },
            ...init
        });

        return [await result.json(), result.ok];
    }

    const logout = () => {
        setLogged(false);
        setUsername("");
        setRoles([]);
        setToken(null);

        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("roles");

        history.push("/");
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        const roles = JSON.parse(localStorage.getItem("roles") || "[]");

        if(token && username && roles) {
            setLogin({token, username, roles});
        }

    }, []);

    useEffect(() => {
        console.log(logged);
    }, [logged]);

    return(
        <userContext.Provider value={{
            logged, username, roles,
            login, logout, fetchApi
        }}>
            { children }
        </userContext.Provider>
    )
}

export { UserProvider };