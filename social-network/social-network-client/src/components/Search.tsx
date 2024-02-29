import { CurrentUser } from "@/utils/CurrentUserType";
import { LoadingAtom } from "@/utils/LoadingAtom";
import { TokenAtom } from "@/utils/TokenAtom";
import { Avatar, Divider, Input } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import LoadingState from "./Reusable/LoadingState";
import Layout from "./Layout";
import { MdSearch } from "react-icons/md";
import { User, UserType } from "@/utils/UsersType";
import SearchedUsers from "./Reusable/SearchedUsers";

const Search = () => {
    const [token, setToken] = useAtom(TokenAtom)
    const [load, setLoad] = useAtom(LoadingAtom)

    const [searchedUser, setSearchedUser] = useState("")
    const [searchedUsers, setSearchedUsers] = useState<User[]>([])


    //Fetch current user
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

      const {data: users} = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
          const res = await axios.get(`http://localhost:8055/users?limit=10`)
          const data = res.data as UserType
    
          
          
          return data.data
        }, 
        refetchOnWindowFocus: false
    })

    const search = async (event: React.FormEvent) => {
        event.preventDefault();
                if (searchedUser) {
                        
                        const res = await axios.get(`http://localhost:8055/users`, {
                            params: {
                                filter: {
                                    _or: [
                                        { first_name: { _icontains: searchedUser } },
                                        { last_name: { _icontains: searchedUser } },
                                    ]
                                }
                            }
                        });
                    
                        const data = res.data as UserType;
                        
                        setSearchedUsers(data.data);
                        
                        return data.data;
                }
        }



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

      if (isFetched || isSuccess) {
        
            return (
                <>
                <Layout>
                    <div className="md:ml-[15%] md:w-[85%] w-full space-y-12 md:p-6 p-2 border h-[100dvh] overflow-auto">
                    <div className="flex w-full justify-between items-center">
                        <div className="md:text-4xl text-2xl font-bold">Search Users</div>
                        <div className="flex items-center gap-2">
                            <p className="">Welcome, <span className="font-bold">{data?.first_name}</span></p>
                            <Avatar size="lg" src={`http://localhost:8055/assets/${data?.avatar}`}/>
                        </div>
                    </div>
                    <div className="md:w-2/3 flex flex-col gap-6">
                        <form onSubmit={search}>
                            <Input onChange={(event) => setSearchedUser(event.target.value)} variant="faded" startContent={<MdSearch size={25}/>} placeholder="Search Users"/>
                        </form>
                        <div className="w-full flex flex-col gap-4">
                            <p className="">Searched <span className="font-bold"> {searchedUser}</span></p>
                            
                            {
                                searchedUsers.length > 0 &&
                                searchedUsers.map(item => {
                                    return (
                                        <>
                                            <SearchedUsers key={item.id} info={item}/>
                                        </>
                                    )
                                })
                            }
                            <Divider/>
                            <p className="">Know users</p>
                            {
                                    users?.map(item => {
                                        return <SearchedUsers key={item.id} info={item}/>
                                    })
                            }
                        </div>
                    </div>
                    </div>
                </Layout>
                </>
            );
    }
}

export default Search;