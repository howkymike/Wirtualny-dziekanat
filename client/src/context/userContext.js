import React, { useState, useEffect, createContext } from 'react';
import { useHistory } from 'react-router-dom';
// @ts-ignore
export const userContext = createContext();
export const api = "http://localhost:8080/api";

const UserProvider = ({children}) => {

    let [username, setUsername] = useState(localStorage.getItem("username") || "");
    let [token, setToken] = useState(localStorage.getItem("token"));
    let [roles, setRoles] = useState(JSON.parse(localStorage.getItem("roles") || "[]"));
    let [userId, setUserId] = useState(localStorage.getItem('userId') || -1);
    let [logged, setLogged] = useState(!!username.length);
    
    const [attemptsRemaining, setAttemptsRemaining] = useState(3);

    const history = useHistory();

    const setLogin = ({token, username, roles, id}) => {
        setToken(token);
        setUsername(username);
        setUserId(id)
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
    const login = async (username, password, role) => {
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

        if(json.roles.find(val => val === role)) {
            json.roles[0] = role;
        } else 
            throw new Error("Wybrano złą rolę");

        setLogin(json);

        localStorage.setItem("token", json.token);
        localStorage.setItem("username", json.username);
        localStorage.setItem("roles", JSON.stringify(json.roles));
        localStorage.setItem('userId', json.id);

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
        localStorage.removeItem("userId");
        localStorage.removeItem("roles");

        history.push("/");
    }

    useEffect(() => {
        console.log(logged);
    }, [logged]);

    return(
        <userContext.Provider value={{
            logged, username, roles, userId,
            login, logout, fetchApi
        }}>
            { children }
        </userContext.Provider>
    )
}

export { UserProvider };