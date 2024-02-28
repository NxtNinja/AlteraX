export interface PostType {
    data: Post[]
}

export interface Post {
    id: string
    user_created: string
    date_created: string
    post_title: string
    post_img: string
}
