import { Avatar, Button, Divider } from "@nextui-org/react";
import Layout from "./Layout";
import { CurrentUser, Data } from "@/utils/CurrentUserType";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PostType } from "@/utils/PostType";
import PostCard from "./Reusable/PostCard";
import { useAtom } from "jotai";
import { TokenAtom } from "@/utils/TokenAtom";
import { useEffect } from "react";
import { LoadingAtom } from "@/utils/LoadingAtom";
import LoadingState from "./Reusable/LoadingState";

const UserProfile = ({info}: {info: Data}) => {
    const [token, setToken] = useAtom(TokenAtom)
    const [load, setLoad] = useAtom(LoadingAtom)


    console.log(info);
    
    const {data: post_data} = useQuery({
        queryKey: ['user-posts', info?.id],
        queryFn: async () => {
          const res = await axios.get(`http://localhost:8055/items/posts?filter[user_created][_eq]=${info?.id}`)
          const data = res.data as PostType
    
          
          
          return data.data
        }, 
        refetchOnWindowFocus: false
    })

    const {data, isLoading, isFetching, isFetched, isSuccess} = useQuery({
        queryKey: ['current-user', token],
        queryFn: async () => {
          const res = await axios.get("http://localhost:8055/users/me", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          const data = res.data as CurrentUser
    
          
          
          return data.data
        }, 
        refetchOnWindowFocus: false
      })

      useEffect(() => {
        if (isLoading || isFetching) {
          setLoad(true)
        } else{
          setLoad(false)
        }
      }, [isLoading, isFetching])

      if (isLoading || isFetching) {
        return <LoadingState/>
      }

      if (data === undefined) {
        return
      }

      if (isFetched && isSuccess) {
        return (
            <>
                <Layout>
                <div className="md:ml-[15%] md:w-[85%] w-full space-y-12 md:p-6 p-2 border h-[100dvh] overflow-auto">
                    <div className="flex w-full justify-between items-center">
                        <div className="text-4xl font-bold">User Profile</div>
                        <div className="flex items-center gap-2">
                            <p className="">Welcome, <span className="font-bold">{data.first_name}</span></p>
                            <Avatar size="lg" src={`http://localhost:8055/assets/${data?.avatar}`}/>
                        </div>
                    </div>
                    <div className="flex flex-col gap-10">
                        <div className="flex gap-3 items-center">
                            <div className="flex flex-col gap-2">
                                <Avatar src={`http://localhost:8055/assets/${info?.avatar}`} className="w-48 h-48"/>
                            </div>
                            <div className="flex items-start text-2xl flex-col gap-2">
                                <p className="">
                                    <span className="">Name: </span>
                                    <span className="font-bold">{info?.first_name} {info?.last_name}</span>
                                </p>
                                <p className="">
                                    <span className="">Email: </span>
                                    <span className="font-bold">{info?.email}</span>
                                </p>
                                <p className="">
                                    <span className="">Profession: I am a </span>
                                    <span className="font-bold">{info?.title}</span>
                                </p>
                                <p className="">
                                    <span className="">Bio: </span>
                                    <span className="font-bold">{info?.description}</span>
                                </p>
                            </div>
                        </div>
                        <Divider/>
                        <div className="flex flex-col gap-6">
                            <p className="text-xl font-bold underline">All Posts</p>
                            <div className="flex flex-col md:w-2/3 w-full gap-3">
                            {
                                post_data?.map(item => {
                                    return <PostCard key={item.id} user={data} info={item}/>
                                })
                            }
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
            </>
        );
      }
    
}

export default UserProfile;