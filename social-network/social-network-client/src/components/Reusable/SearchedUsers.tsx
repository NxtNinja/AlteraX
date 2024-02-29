import { Data } from "@/utils/CurrentUserType";
import { User } from "@/utils/UsersType";
import { Avatar } from "@nextui-org/react";
import { useRouter } from "next/router";

const SearchedUsers = ({info}: {info: User}) => {
    const router = useRouter()
    return (
        <>
            <div onClick={() => router.push(`/userProfile/${info.id}`)} className="flex items-center gap-2 cursor-pointer">
                <Avatar src={`http://localhost:8055/assets/${info?.avatar}`} size="lg"/>
                <div className="flex flex-col gap-1">
                    <p className="text-base font-bold">{info?.first_name} {info?.last_name}</p>
                    <p className="text-sm">{info.title}</p>
                </div>
            </div>
        </>
    );
}

export default SearchedUsers;