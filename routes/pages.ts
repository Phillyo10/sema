import express from 'express'
import cookieParser from 'cookie-parser'
import { UserAuth, Post, PostComment } from '../types/types'
import { postsDb, usersDb, commentsDb } from '../mydb/db.config.js'
import randomUserId from '../includes/userid.js'
import randomPostId from '../includes/postid.js'
import { currentDate, currentTime } from '../includes/date.js'

export const mainPagesRouter = express.Router()
mainPagesRouter.use(cookieParser())

mainPagesRouter.get("/", (request, response) => {
    let userid = request.cookies["semauser"] as string | null
    if (userid == "" || userid == null) {
        response.redirect("/login")
    } else {
        usersDb.findOne({ userid: userid }, (data:any, err:any) => {
            if (!err) {
                const userinfo: UserAuth = data;
                const verified_checkmark = userinfo.verified ? `verified`:''
                response.render("index", { userinfo: userinfo, vcm: verified_checkmark })
            } else response.redirect("logout")
        })
    }
})

mainPagesRouter.get("/@:rid", (request, response) => {
    response.send(request.params['rid'])
})

mainPagesRouter.get("/myprofile", (request, response) => {
    let cookie = request.cookies["semauser"] as string | null
    if (cookie == "" || cookie == null) {
        response.redirect("login")
    } else {
        response.render("profile")
    }
})