import { CurrentUser } from "@/utils/CurrentUserType";
import Layout from "./Layout";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { PostType } from "@/utils/PostType";
import { useAtom } from "jotai";
import { TokenAtom } from "@/utils/TokenAtom";
import { LoadingAtom } from "@/utils/LoadingAtom";
import { useEffect } from "react";
import LoadingState from "./Reusable/LoadingState";
import { Avatar } from "@nextui-org/react";
import NoDataState from "./Reusable/NoDataState";
import PostCard from "./Reusable/PostCard";

const Discover = () => {
    const [token, setToken] = useAtom(TokenAtom)
    const [load, setLoad] = useAtom(LoadingAtom)

        //Fetch current user
        const {data} = useQuery({
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


          const {data: post_data, isLoading, isFetching, isFetched, isSuccess} = useQuery({
            queryKey: ['all-posts'],
            queryFn: async () => {
              const res = await axios.get("http://localhost:8055/items/posts?sort=-date_created")
              const data = res.data as PostType
        
              
              
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

          if(data === undefined){
            return
          }
    return (
        <>
            <Layout>
                <div className="md:ml-[15%] md:w-[85%] w-full space-y-12 md:p-6 p-2 border h-[100dvh] overflow-auto">
                    <div className="flex w-full justify-between items-center">
                        <div className="md:text-4xl text-xl font-bold">Discover Posts</div>
                        <div className="flex items-center gap-2">
                            <p className="">Welcome, <span className="font-bold">{data.first_name}</span></p>
                                <Avatar size="lg" src={`http://localhost:8055/assets/${data?.avatar}`}/>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 w-full space-y-6">
                                {
                                  post_data?.length !== 0 ? 
                                    post_data?.map(item => {
                                        return <PostCard key={item.id} user={data} info={item} isDiscover={true}/>
                                    }) : 
                                    <div className="w-full">
                                        <NoDataState/>
                                    </div>
                                }
                            </div>
                </div>
            </Layout>
        </>
    );
}

export default Discover;