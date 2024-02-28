import { Comment } from "@/utils/CommentType";
import { CurrentUser } from "@/utils/CurrentUserType";
import { Avatar } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const CommentCard = ({info}: {info: Comment}) => {

    const {data} = useQuery({
        queryKey: ['commented-by', info.user_created],
        queryFn: async () => {
          const res = await axios.get(`http://localhost:8055/users/${info.user_created}`)
          const data = res.data as CurrentUser
    
          
          
          return data.data
        }, 
        refetchOnWindowFocus: false
    })
    return (
        <>
            <div className="flex items-center gap-2">
                <Avatar src={`http://localhost:8055/assets/${data?.avatar}`} size="sm"/>
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold">{data?.first_name} {data?.last_name}</p>
                    <p className="text-sm">{info.comment_title}</p>
                </div>
            </div>
        </>
    );
}

export default CommentCard;