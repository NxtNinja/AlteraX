import Search from "@/components/Search"
import { useRouter } from "next/router";
import { useEffect } from "react";

const search = () => {
    const router = useRouter()
  
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            router.push("/auth/login")
        }
    }, []);
    return (
        <>
            <Search/>
        </>
    );
}

export default search;