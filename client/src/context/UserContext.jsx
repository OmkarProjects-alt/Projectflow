import { cache, createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useError } from "./ErrorAndSuccessMsgContext";

const CreateUserContext = createContext();

export const useUserContext = () => useContext(CreateUserContext);

const UserContext = ({children}) => {
    const [userData, setUserData] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { addMessage } = useError();

    const logoutUser = () => {
        return api.post(
            "/auth/logout",
            {},
        );
    };

    const verifySession = () => {
        return api.get("/auth/me");
    };

    const fetchUserData = async () => {
        if (userData || loading) return;

        setLoading(true);

        try {
            const result = await api.post('/auth/verify-session');

            if (result.data.success) {
                setUserData(result.data.user);                
            }
        } catch (error) {
            addMessage(
                error?.response?.data?.message ||
                error.message
            );
        } finally {
            setLoading(false);
        }
    };

  return (
    <CreateUserContext.Provider
        value={{
            userData,
            setUserData,
            fetchUserData,
            logoutUser,
            verifySession
        }}
    >
        {children}
    </CreateUserContext.Provider>
  )
}

export default UserContext
