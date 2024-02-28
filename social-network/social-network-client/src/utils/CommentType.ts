export interface CommentType {
    data: Comment[]
}

export interface Comment {
    id: string
    user_created: string
    comment_title: string
    post_id: string
}
