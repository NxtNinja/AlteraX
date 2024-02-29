import { CommentType } from "@/utils/CommentType";
import { CurrentUser, Data } from "@/utils/CurrentUserType";
import { LikesType } from "@/utils/LikesType";
import { Post } from "@/utils/PostType";
import {Card, CardHeader, CardBody, Image, Avatar, CardFooter, Divider, Input, Popover, PopoverTrigger, PopoverContent, Button} from "@nextui-org/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { LiaCommentSolid } from "react-icons/lia";
import { MdOutlineThumbUp, MdSend, MdThumbUp } from "react-icons/md";
import CommentCard from "./CommentCard";
import { useAtom } from "jotai";
import { TokenAtom } from "@/utils/TokenAtom";
import { SubmitHandler, useForm } from "react-hook-form";
import { CiMenuKebab } from "react-icons/ci";
import DeleteBtn from "../Buttons/DeleteBtn";
import { useRouter } from "next/router";

type Comment = {
    comment: string
}


const PostCard = ({user, info, isDiscover}: {user: Data, info: Post, isDiscover: boolean}) => {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
      } = useForm<Comment>()
    const [token, setToken] = useAtom(TokenAtom)
    const queryClient = useQueryClient()

    const [openComment, setOpenComment] = useState(false)
    const [liked, setLiked] = useState(false)


    const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC"
      };

      const date = new Date(info.date_created);
      const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

      const posting_date = formattedDate.replace(/\s(?=[AP]M)/, " ")

      // fetch the user who created the post
    const {data} = useQuery({
        queryKey: ['posted-by', info.user_created],
        queryFn: async () => {
          const res = await axios.get(`http://localhost:8055/users/${info.user_created}`)
          const data = res.data as CurrentUser
    
          
          
          return data.data
        }, 
        refetchOnWindowFocus: false
    })

    //fetch all the likes
    const {data: likes} = useQuery({
        queryKey: ['liked-posts'],
        queryFn: async () => {
            const req = await axios.get("http://localhost:8055/items/likes")
            const data = req.data as LikesType

            return data.data
        },
        refetchOnWindowFocus: false
    })

    console.log(likes);

    //filtering the number of likes for each post
    const matched_Likes = likes?.filter(item => {
        return item.post_id === info.id
    })

    //if current user liked a post
    useEffect(() => {
        if (likes !== undefined && likes?.length > 0 && user) {
            const userLiked = likes.some(item => item.user_created === user.id && item.post_id === info.id);
            setLiked(userLiked);
        }
    }, [likes, user, info]);

    console.log(liked);

    //fetch the comments
    const {data: comments} = useQuery({
        queryKey: ['comments-posts', info.id],
        queryFn: async () => {
            const req = await axios.get(`http://localhost:8055/items/comments?filter[post_id][_eq]=${info.id}`)
            const data = req.data as CommentType

            return data.data
        },
        refetchOnWindowFocus: false
    })
    console.log(comments);

    //Handle liking the posts
    const makePostLike = async () => {
        try {
            const req = await axios.post("http://localhost:8055/items/likes",{
                "post_id": info.id
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            queryClient.invalidateQueries({queryKey: ['liked-posts']})
        } catch (error) {
            console.log(error);
            
        }
    }

    //Handle making comments
    const createComment: SubmitHandler<Comment> = async (data) => {
        console.log(data);
        try {
           const req = await axios.post(`http://localhost:8055/items/comments`, {
            "comment_title": data.comment,
            "post_id": info.id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            queryClient.invalidateQueries({queryKey: ['comments-posts']})
        } catch (error) {
            console.log(error);
        }
    }
    
    
    return (
        <>
            <Card className="py-4 space-y-3 h-fit">
                <CardHeader className="pb-0 pt-2 px-4 flex items-center justify-between">
                    <div onClick={() => router.push(`/userProfile/${info.user_created}`)} className="flex items-center cursor-pointer gap-2">
                        <Avatar src={`http://localhost:8055/assets/${data?.avatar}`}/>
                        <div className="flex flex-col">
                            <p className="text-xl font-bold">{data?.first_name} {data?.last_name}</p>
                            <p className="">{posting_date}</p>
                        </div>
                    </div>
                    {
                        user.id === info.user_created && (
                            <Popover placement="bottom" showArrow={true}>
                                <PopoverTrigger>
                                    <Button isIconOnly className="bg-transparent">
                                        <CiMenuKebab size={20}/>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <DeleteBtn info={info}/>
                                </PopoverContent>
                            </Popover>
                        )
                    }
                    
                </CardHeader>
                <CardBody className="overflow-hidden py-2 w-full space-y-3">
                    <p className="">{info.post_title}</p>
                    <div className="w-full h-full">
                        <img src={`http://localhost:8055/assets/${info.post_img}`} className="rounded-xl mt-auto object-cover" alt="" />
                    </div>
                </CardBody>
                {
                    !isDiscover &&
                    <CardFooter className="pt-2 px-4 flex flex-col gap-4">
                        <div className="flex w-full justify-between items-center">
                            {
                                liked ? 
                                <div className="flex gap-2 items-center">
                                    <MdThumbUp size={30} className="text-blue-500"/>
                                    <p className="">{matched_Likes?.length}</p>
                                </div> : 
                                <div className="flex gap-2 items-center">
                                    <MdOutlineThumbUp onClick={makePostLike} className="cursor-pointer" size={30}/>
                                    <p className="">{matched_Likes?.length}</p>
                                </div>
                            }
                            <div className="flex gap-2 items-center">
                                <LiaCommentSolid className="cursor-pointer" onClick={() => setOpenComment(prev => !prev)} size={30}/>
                                <p className="">{comments?.length}</p>
                            </div>
                        </div>
                        {
                            openComment && (
                                <div className="flex flex-col w-full">
                                    <div className="h-48 p-3 overflow-y-auto flex border w-full flex-col gap-3">
                                        <p className="w-full font-bold">Comments</p>
                                        <Divider/>
                                        <div className="flex flex-col gap-4">
                                            {
                                                comments?.map(item => {
                                                    return <CommentCard key={item.id} info={item}/>
                                                })
                                            }
                                        </div>
                                    </div>
                                    <form onSubmit={handleSubmit(createComment)}>
                                        <Input
                                        {
                                            ...register("comment", {
                                                required: {
                                                    value: true,
                                                    message: "This filed is required"
                                                },
                                                pattern: {
                                                    value: /^[\p{L}\p{N}\s\d\s.:;!?()[\]{}'"`*_#+=<>$%^&|\\/,@-]+$/u,
                                                    message: "Validation failed"
                                                }
                                            })
                                        }
                                        placeholder="Write a comment" className="" endContent={<MdSend size={20} type="submit"/>} radius="none" variant="faded"/>
                                    </form>
                                </div>
                            )
                        }
                        
                    </CardFooter>
                }
            </Card>
        </>
    );
}

export default PostCard;