import express from 'express'
import cookieParser from 'cookie-parser'
import { UserAuth, Post, PostComment } from '../types/types'
import { usersDb } from '../mydb/db.config.js'
import randomUserId from '../includes/userid.js'
import randomPostId from '../includes/postid.js'
import { currentDate, currentTime } from '../includes/date.js'

export const logonRouter = express.Router()
logonRouter.use(cookieParser())

logonRouter.get("/login", (request, response) => {
    let cookie = request.cookies["semauser"] as string | null
    if (cookie == "" || cookie == null) {
        response.render("login")
    } else {
        response.redirect("/")
    }
})

logonRouter.post("/loginreq", (request, response) => {
    let username = request.body.username
    let password = request.body.pwd
    console.log([username, password])
    usersDb.findOne({ username: username, password: password }, (data:any, err:any) => {
        if (!err) {
            if (data) {
                response.cookie("semauser", data.userid, {
                    maxAge: 86400000,
                    httpOnly: true,
                    path: "/"
                })
                response.send("granted")
            } else response.send("fail")
        } else response.send("fail")
    })
})

logonRouter.get("/signup", (request, response) => {
    let cookie = request.cookies["semauser"] as string | null
    if (cookie == "" || cookie == null) {
        response.render("signup")
    } else {
        response.redirect("/")
    }
})

logonRouter.post("/signupreq", (request, response) => {
    let dname = request.body.dname
    let username = request.body.username
    let password = request.body.pwd

    const user_auth: UserAuth = {
        userid: randomUserId(),
        username: username,
        dname: dname,
        password: password,
        verified: false
    }
    
    usersDb.insert(user_auth, (data:any, err:any) => {
        if (!err) {
            response.cookie("semauser", user_auth.userid, {
                maxAge: 86400000,
                httpOnly: true,
                path: "/"
            })
            response.send("granted")
        } else response.send("fail")
    })
})

logonRouter.get("/logout", (request, response) => {
    response.clearCookie("semauser")
    response.redirect("/login")
})