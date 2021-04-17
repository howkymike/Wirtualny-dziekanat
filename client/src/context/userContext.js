import React, { useState, useEffect, createContext } from 'react';
import { useHistory } from 'react-router-dom';
// @ts-ignore
export const userContext = createContext();
export const api = "http://localhost:8080/api";

const UserProvider = ({children}) => {

    let [username, setUsername] = useState(localStorage.getItem("username") || "");
    let [token, setToken] = useState(localStorage.getItem("token"));
    let [roles, setRoles] = useState(JSON.parse(localStorage.getItem("roles") || "[]"));
    let [logged, setLogged] = useState(!!username.length);
    
    const [attemptsRemaining, setAttemptsRemaining] = useState(3);

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
                if(json.message === "Bad credentials" && attemptsRemaining) {
                    setAttemptsRemaining(attemptsRemaining - 1);
                    if(attemptsRemaining)
                        throw new Error("Wrong credentials\nRemaining attempts " + attemptsRemaining);
                }
                else if(json.message === "User account is locked" || !attemptsRemaining)
                    throw new Error("Account locked");

            throw new Error("Can't login");
        }

        setAttemptsRemaining(3)

        if(json.firstTime) {
            history.push("/firsttime/" + json.token);
            return;
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