import { R_tokenAtom } from "@/utils/TokenAtom";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { IoLogOutOutline } from "react-icons/io5";

const LogoutBtn = () => {
    const [rtoken, setRToken] = useAtom(R_tokenAtom)

    const router = useRouter()

    const logoutUser = async () => {
        try {
            await axios.post("http://localhost:8055/auth/logout", {
                "refresh_token": rtoken
            })
            localStorage.clear()
            router.push("/auth/login")  
        } catch (error) {
            console.log(error);
            
        }
        
    }

    return (
        <>
            <Button onClick={logoutUser} startContent={<IoLogOutOutline size={20}/>} className=" w-full" color="danger" variant="solid">Logout</Button>
        </>
    );
}

export default LogoutBtn;