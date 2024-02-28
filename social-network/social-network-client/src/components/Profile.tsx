import Layout from "./Layout";
import { Avatar, Button, Divider, useDisclosure } from "@nextui-org/react";
import { CurrentUser } from "@/utils/CurrentUserType";
import { useAtom } from "jotai";
import { TokenAtom } from "@/utils/TokenAtom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PostType } from "@/utils/PostType";
import PostCard from "./Reusable/PostCard";
import EditProfileModal from "./modals/EditProfileModal";
import { LoadingAtom } from "@/utils/LoadingAtom";
import { useEffect } from "react";
import LoadingState from "./Reusable/LoadingState";

const Profile = () => {
    const [token, setToken] = useAtom(TokenAtom)
    const [load, setLoad] = useAtom(LoadingAtom)
    
    const {isOpen, onOpen, onOpenChange} = useDisclosure();


        //Fetch current user
        const {data: current_user, isLoading, isFetching, isFetched, isSuccess} = useQuery({
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


        const {data: post_data} = useQuery({
            queryKey: ['related-posts', current_user?.id],
            queryFn: async () => {
              const res = await axios.get(`http://localhost:8055/items/posts?filter[user_created][_eq]=${current_user?.id}`)
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

        if (current_user === undefined) {
            return
        }

        if (isFetched && isSuccess) {
           return (
                <>
                <Layout>
                    <div className="md:ml-[15%] md:w-[85%] w-full space-y-12 md:p-6 p-2 border h-[100dvh] overflow-auto">
                        <div className="flex w-full justify-between items-center">
                            <div className="text-4xl font-bold">My Profile</div>
                            <div className="flex items-center gap-2">
                                <p className="">Welcome, <span className="font-bold">{current_user.first_name}</span></p>
                                <Avatar size="lg" src={`http://localhost:8055/assets/${current_user?.avatar}`}/>
                            </div>
                        </div>
                        <div className="flex flex-col gap-10">
                            <div className="flex gap-3 items-center">
                                <div className="flex flex-col gap-2">
                                    <Avatar src={`http://localhost:8055/assets/${current_user?.avatar}`} className="w-48 h-48"/>
                                    <Button onPress={onOpen} color="primary" radius="sm">Edit profile</Button>
                                    <EditProfileModal isOpen={isOpen} onOpenChange={onOpenChange} user={current_user}/>
                                </div>
                                <div className="flex items-start text-2xl flex-col gap-2">
                                    <p className="">
                                        <span className="">Name: </span>
                                        <span className="font-bold">{current_user?.first_name} {current_user?.last_name}</span>
                                    </p>
                                    <p className="">
                                        <span className="">Email: </span>
                                        <span className="font-bold">{current_user?.email}</span>
                                    </p>
                                    <p className="">
                                        <span className="">Profession: I am a </span>
                                        <span className="font-bold">{current_user?.title}</span>
                                    </p>
                                    <p className="">
                                        <span className="">Bio: </span>
                                        <span className="font-bold">{current_user?.description}</span>
                                    </p>
                                </div>
                            </div>
                            <Divider/>
                            <div className="flex flex-col gap-6">
                                <p className="text-xl font-bold underline">My Posts</p>
                                <div className="flex flex-col md:w-2/3 w-full gap-3">
                                {
                                    post_data?.map(item => {
                                        return <PostCard key={item.id} user={current_user} info={item}/>
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

export default Profile;