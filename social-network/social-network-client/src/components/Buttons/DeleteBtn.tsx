import { Post } from "@/utils/PostType";
import { Button } from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const DeleteBtn = ({info}: {info: Post}) => {
    const queryClient = useQueryClient()

    const deletePost = async (id: string, img_id: string) => {
        try {
            await axios.delete(`http://localhost:8055/items/posts/${id}`)
            await axios.delete(`http://localhost:8055/files/${img_id}`)
            queryClient.invalidateQueries({queryKey: ['related-posts']})
        } catch (error) {
            console.log(error);
            
        }
    }
    return (
        <>
            <Button onClick={() => deletePost(info.id, info.post_img)} className="w-full" color="danger" variant="light">Delete post</Button>
        </>
    );
}

export default DeleteBtn;