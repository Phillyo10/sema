export type UserAuth = {
    userid: string,
    username: string,
    dname: string,
    password: string,
    verified: boolean
}

export type Post = {
    postid: string,
    userid: string,
    post: string,
    time: string,
    date: string,
    repost: boolean,
    repostid: string
}

export type PostComment = {
    postid: string,
    userid: string,
    comment: string
}

export type PostLike = {
    postid: string,
    userid: string
}