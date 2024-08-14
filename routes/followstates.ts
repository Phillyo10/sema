import express, { response } from 'express'
import cookieParser from 'cookie-parser'
import { UserAuth, Post, PostComment, PostLike, Notification, FollowState } from '../types/types'
import { postsDb, usersDb, commentsDb, likesDb, notificationsDb, followersDb } from '../mydb/db.config.js'
import randomUserId from '../includes/userid.js'
import randomPostId from '../includes/postid.js'
import { currentDate, currentTime } from '../includes/date.js'

export const followStatesRouter = express.Router()
followStatesRouter.use(cookieParser())

followStatesRouter.post("/isfollowing/:following", (request, response) => {
    let userid = request.cookies["semauser"] as string | null
    let followingUserId = request.params.following
    if (userid == "" || userid == null) {
        response.send("fail")
    } else {
        const following: FollowState = {
            userid: userid,
            following: followingUserId
        }
        followersDb.findOne(following, (data: any, err: any) => {
            if (!err) response.send(data); else response.send("fail")
        })
    }
})

followStatesRouter.post("/user", (request, response) => {
    let userid = request.cookies["semauser"] as string | null
    let followingUserId = request.body.following
    if (userid == "" || userid == null) {
        response.send("fail")
    } else {
        const following: FollowState = {
            userid: userid,
            following: followingUserId
        }
        followersDb.insert(following, (data: any, err: any) => {
            if (!err) response.send(data); else response.send("fail")
        })
    }
})

followStatesRouter.post("/unfuser", (request, response) => {
    let userid = request.cookies["semauser"] as string | null
    let followingUserId = request.body.following
    if (userid == "" || userid == null) {
        response.send("fail")
    } else {
        const following: FollowState = {
            userid: userid,
            following: followingUserId
        }
        followersDb.delete(following, (data: any, err: any) => {
            if (!err) response.send(data); else response.send("fail")
        })
    }
})