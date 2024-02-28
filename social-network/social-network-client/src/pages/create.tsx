import CreatePost from "@/components/CreatePost";
import { useRouter } from "next/router";
import { useEffect } from "react";

const create = () => {
    const router = useRouter()
  
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            router.push("/auth/login")
        }
    }, []);
    return (
        <>
            <CreatePost/>
        </>
    );
}

export default create;