import Profile from "@/components/Profile";
import { useRouter } from "next/router";
import { useEffect } from "react";

const profile = () => {
    const router = useRouter()
  
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            router.push("/auth/login")
        }
    }, []);
    
    return (
        <>
            <Profile/>
        </>
    );
}

export default profile;