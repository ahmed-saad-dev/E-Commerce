import { createContext, useEffect, useState } from "react";

export let userContext = createContext();

export default function UserContextProvider(props) {

    let [isLogin, setLogin] = useState(null);
    let [isSignupMessage, setSignupMessage] = useState(null);
    let [isSellerOrUser, setSellerOrUser] = useState(localStorage.getItem("role") || "user");
    let [sellerEmail, setSellerEmail] = useState('');
    ///////////////
    let [sellerEditImage, setSellerEditImage] = useState('');
    let [sellerEditName, setSellerEditName] = useState('');
    let [sellerEditPhone, setSellerEditPhone] = useState('');
    ///////////////
    
    // let [isLogout, setLogout] = useState(false);

    useEffect(() => {
        if(localStorage.getItem('userToken') !== null) {
            setLogin(localStorage.getItem('userToken'));
        }
    }, []);

    return <userContext.Provider value={{isLogin, setLogin, isSignupMessage, setSignupMessage, isSellerOrUser, setSellerOrUser, sellerEmail, setSellerEmail, sellerEditImage, sellerEditName, sellerEditPhone, setSellerEditImage, setSellerEditName, setSellerEditPhone}}>
        {props.children}
    </userContext.Provider>
} 


