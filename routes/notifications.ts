import express, { response } from 'express'
import cookieParser from 'cookie-parser'
import { UserAuth, Post, PostComment, PostLike, Notification } from '../types/types'
import { postsDb, usersDb, commentsDb, likesDb, notificationsDb } from '../mydb/db.config.js'
import randomUserId from '../includes/userid.js'
import randomPostId from '../includes/postid.js'
import { currentDate, currentTime } from '../includes/date.js'

export const notificationsRouter = express.Router()
notificationsRouter.use(cookieParser())


notificationsRouter.post("/countnotifications", (request, response) => {
    let userid = request.cookies["semauser"] as string | null
    if (userid == "" || userid == null) {
        response.send("fail")
    } else {
        notificationsDb.find({ receivinguser: userid, read: false }, (data: any, err: any) => {
            if (!err) response.send(`${data.length}`); else response.send("fail")
        })
    }
})

notificationsRouter.post("/readall", (request, response) => {
    let userid = request.cookies["semauser"] as string | null
    if (userid == "" || userid == null) {
        response.send("fail")
    } else {
        notificationsDb.update({ receivinguser: userid, read: false }, {read: true}, true, (data: any, err: any) => {
            if (!err) response.send("done"); else response.send("fail")
        })
    }
})

notificationsRouter.get("/notifications", (request, response) => {
    let userid = request.cookies["semauser"] as string | null
    if (userid == "" || userid == null) {
        response.send("fail")
    } else {
        notificationsDb.find({ receivinguser: userid }, (data: any, err: any) => {
            if (!err) response.send(JSON.stringify(data)); else response.send("fail")
        })
    }
})

notificationsRouter.post("/post", (request, response) => {
    let userid = request.cookies["semauser"] as string | null
    if (userid == "" || userid == null) {
        response.send("fail")
    } else {
        let postid = request.body.postid
        postsDb.findOne({ postid: postid }, (data:any, err:any) => {
            let postdata: Post = data;
            let newNotification: Notification = {
                type: "post",
                taguserid: userid,
                receivinguser: postdata.userid,
                read: false,
                time: Date.now()
            }
            notificationsDb.insert(newNotification, (data:any, err:any) => {
                if (data) response.send("done"); else response.send("fail")
            })
        })
    }
})

notificationsRouter.post("/repost", (request, response) => {
    let userid = request.cookies["semauser"] as string | null
    if (userid == "" || userid == null) {
        response.send("fail")
    } else {
        let postid = request.body.postid
        postsDb.findOne({ postid: postid }, (data:any, err:any) => {
            let postdata: Post = data;
            let newNotification: Notification = {
                type: "repost",
                taguserid: userid,
                receivinguser: postdata.userid,
                read: false,
                time: Date.now()
            }
            notificationsDb.insert(newNotification, (data:any, err:any) => {
                if (data) response.send("done"); else response.send("fail")
            })
        })
    }
})

notificationsRouter.post("/likepost", (request, response) => {
    let userid = request.cookies["semauser"] as string | null
    if (userid == "" || userid == null) {
        response.send("fail")
    } else {
        let postid = request.body.postid
        postsDb.findOne({ postid: postid }, (data:any, err:any) => {
            let postdata: Post = data;
            let newNotification: Notification = {
                type: "like",
                taguserid: userid,
                receivinguser: postdata.userid,
                read: false,
                time: Date.now()
            }
            notificationsDb.insert(newNotification, (data:any, err:any) => {
                if (data) response.send("done"); else response.send("fail")
            })
        })
    }
})

notificationsRouter.post("/commentpost", (request, response) => {
    let userid = request.cookies["semauser"] as string | null
    if (userid == "" || userid == null) {
        response.send("fail")
    } else {
        let postid = request.body.postid
        postsDb.findOne({ postid: postid }, (data:any, err:any) => {
            let postdata: Post = data;
            let newNotification: Notification = {
                type: "comment",
                taguserid: userid,
                receivinguser: postdata.userid,
                read: false,
                time: Date.now()
            }
            notificationsDb.insert(newNotification, (data:any, err:any) => {
                if (data) response.send("done"); else response.send("fail")
            })
        })
    }
})


notificationsRouter.post("/followuser", (request, response) => {
    let userid = request.cookies["semauser"] as string | null
    if (userid == "" || userid == null) {
        response.send("fail")
    } else {
        let receivinguserid = request.body.userid
        let newNotification: Notification = {
            type: "follow",
            taguserid: userid,
            receivinguser: receivinguserid,
            read: false,
            time: Date.now()
        }
        notificationsDb.insert(newNotification, (data:any, err:any) => {
            if (data) response.send("done"); else response.send("fail")
        })
    }
})

notificationsRouter.post("/unfollowuser", (request, response) => {
    let userid = request.cookies["semauser"] as string | null
    if (userid == "" || userid == null) {
        response.send("fail")
    } else {
        let receivinguserid = request.body.userid
        let newNotification: Notification = {
            type: "unfollow",
            taguserid: userid,
            receivinguser: receivinguserid,
            read: false,
            time: Date.now()
        }
        notificationsDb.insert(newNotification, (data:any, err:any) => {
            if (data) response.send("done"); else response.send("fail")
        })
    }
})