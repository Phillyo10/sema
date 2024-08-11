import express from 'express'
import cookieParser from 'cookie-parser'
import { UserAuth, Post, PostComment, PostLike } from '../types/types'
import { postsDb, usersDb, commentsDb, likesDb } from '../mydb/db.config.js'
import randomUserId from '../includes/userid.js'
import randomPostId from '../includes/postid.js'
import { currentDate, currentTime } from '../includes/date.js'

export const indexRequestsRouter = express.Router()
indexRequestsRouter.use(cookieParser())

async function getpostlikes(filter:object) {
    return new Promise((resolve) => {
        likesDb.find(filter, (err1:any, likedata:any) => {
            resolve(likedata)
        })
    })
}

async function getpostcomments(filter:object) {
    return new Promise((resolve) => {
        commentsDb.find(filter, (err1:any, likedata:any) => {
            resolve(likedata)
        })
    })
}

indexRequestsRouter.post("/allposts", (request, response) => {
    postsDb.find({}, async (err:any, data:any) => {
        if (!err) {
            const allpostdata: any[] = []
            for (let i = 0; i < data.length; i++) {
                let likes = await getpostlikes({ postid: data[i].postid })
                let comments = await getpostcomments({ postid: data[i].postid })
                let postdata = data[i]
                postdata.likes = likes
                postdata.comments = comments
                allpostdata.push(postdata)
            }
            response.send(JSON.stringify(allpostdata))
        } else response.send("fail")
    })
})

indexRequestsRouter.post("/getuser", (request, response) => {
    const userid = request.body.userid
    if (userid == "" || userid == null) return
    usersDb.findOne({ userid: userid }, (data:any, err:any) => {
        if (!err) {
            const userinfo = data;
            response.send(JSON.stringify(userinfo))
        } else response.send("fail")
    })
})

indexRequestsRouter.post("/togglelikepost", (request, response) => {
    let userid = request.cookies["semauser"] as string | null
    let like = request.body.like
    let postid = request.body.postid
    if (userid == "" || userid == null) {
        response.send("fail")
    } else {
        if (like ==  true) {
            const likedata: PostLike = { userid: userid, postid: postid }
            likesDb.insert(likedata, (data:any, err:any) => {
                if (!err) response.send("done"); else response.send("fail")
            })
        } else {
            const likedata: PostLike = { userid: userid, postid: postid }
            likesDb.delete(likedata, (data:any, err:any) => {
                if (!err) response.send("done"); else response.send("fail")
            })
        }
    }
})

indexRequestsRouter.post("/getuserc", (request, response) => {
    const userid = request.cookies["semauser"]
    if (userid == "" || userid == null) return
    usersDb.findOne({ userid: userid }, (data:any, err:any) => {
        if (!err) {
            const userinfo = data;
            response.send(JSON.stringify(userinfo))
        } else response.send("fail")
    })
})

indexRequestsRouter.post("/createpost", (request, response) => {
    let userid = request.cookies["semauser"] as string | null
    let post = request.body.post

    if (userid == "" || userid == null) {
        response.send("fail")
    } else {
        const newPost: Post = {
            postid: randomPostId(),
            userid: userid,
            post: post,
            time: currentTime(),
            date: currentDate(),
            repost: false,
            repostid: ""
        }
    
        postsDb.insert(newPost, (data:any, err:any) => {
            if (!err) response.send("done"); else response.send("fail")
        })
    }
})

indexRequestsRouter.post("/createpostcomment", (request, response) => {
    let userid = request.cookies["semauser"] as string | null
    let postid = request.body.postid
    let comment = request.body.comment

    if (userid == "" || userid == null) {
        response.send("fail")
    } else {
        postsDb.findOne({ postid: postid }, (postdata:any, err:any) => {
            if (err) return
            usersDb.findOne({ userid: userid }, (userdata:any, err:any) => {
                if (err) return
                if (userdata && postdata) {
                    let user: UserAuth = userdata;
                    let post: Post = postdata;
                    const newPostComment: PostComment = {
                        userid: user.userid,
                        postid: post.postid,
                        comment: comment
                    }

                    commentsDb.insert(newPostComment, (data:any, err:any) => {
                        if (!err && data) response.send("posted"); else response.send("fail")
                    })
                } else return
            })
        })
    }
})

indexRequestsRouter.post("/loadcomments", (request, response) => {
    let postid = request.body.postid
    commentsDb.find({ postid: postid }, (err:any, data:any) => {
        if (!err) {
            response.send(JSON.stringify(data));
        } else response.send("fail")
    })
})