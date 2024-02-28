import UserProfile from "@/components/UserProfile";
import { CurrentUser } from "@/utils/CurrentUserType";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

const userId = () => {
  const router = useRouter()
  
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            router.push("/auth/login")
        }
    }, []);
    const userid = router.query.userId

    const {data} = useQuery({
        queryKey: ['user', userid],
        queryFn: async () => {
          const res = await axios.get(`http://localhost:8055/users/${userid}`)
          const data = res.data as CurrentUser
    
          
          
          return data.data
        }, 
        refetchOnWindowFocus: false
      })

      if (data === undefined) {
        return
      }
    return (
        <>
            <UserProfile info={data}/>
        </>
    );
}

export default userId;