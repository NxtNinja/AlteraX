import Discover from "@/components/Discover";
import { useRouter } from "next/router";
import { useEffect } from "react";

const discover = () => {
    const router = useRouter()
  
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            router.push("/auth/login")
        }
    }, []);
    return (
        <>
            <Discover/>
        </>
    );
}

export default discover;