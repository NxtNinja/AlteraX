import HomePage from "@/components/HomePage";
import { useRouter } from "next/router";
import { useEffect } from "react";

const index = () => {

  const router = useRouter()
  
  useEffect(() => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
          router.push("/auth/login")
      }
  }, []);
  
  return (
    <>
      <HomePage/>
    </>
  );
}

export default index;