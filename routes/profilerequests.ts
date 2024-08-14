import express, { response } from 'express'
import cookieParser from 'cookie-parser'
import { UserAuth, Post, PostComment } from '../types/types'
import { postsDb, usersDb, commentsDb, followersDb } from '../mydb/db.config.js'
import randomUserId from '../includes/userid.js'
import randomPostId from '../includes/postid.js'
import { currentDate, currentTime } from '../includes/date.js'
import fs, { fdatasync } from 'fs'
import multer from 'multer'
import path from 'path'


export const profileRequestsRouter = express.Router()
profileRequestsRouter.use(cookieParser())

async function uploadPfp(base64: string, userid: string) {
    let base64Data = base64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '');

    // get extension
    const match = base64.match(/^data:image\/([a-zA-Z0-9+]+);base64,/);
    let extension = ""
    if (match && match[1]) extension = match[1]; // "png", "jpeg", "gif", etc.

    // validate base64 data and get all necessary data
    const paddedBase64 = base64Data.padEnd(base64.length + (4 - (base64Data.length % 4)) % 4, '=');
    const buffer = Buffer.from(paddedBase64, 'base64');
    const filename = `${userid}.${extension}`;
    const filepath = path.join('public', 'imgs', 'pfps', filename)

    // check if user already has a profile picture
    const profilePictures = fs.readdirSync(path.join('public', 'imgs', 'pfps'))
    const existingUserProfilePicture = profilePictures.find(file => path.parse(file).name === userid)

    if (existingUserProfilePicture) {
        const existingUserProfilePicturePath = path.join('public', 'imgs', 'pfps', existingUserProfilePicture);
        fs.unlinkSync(existingUserProfilePicturePath)
        fs.writeFileSync(filepath, buffer);
    } else fs.writeFileSync(filepath, buffer);

    return "updated"
}

profileRequestsRouter.post("/userstats", (request, response) => {
    let userid = request.cookies["semauser"] as string | null
    if (userid == "" || userid == null) {
        response.send("fail")
    } else {
        postsDb.find({ userid: userid }, (data: any, err: any) => {
            followersDb.find({ following: userid }, (data1: any, err1: any) => {
                followersDb.find({ userid: userid }, (data2: any, err2: any) => {
                    if (!err && !err1 && !err2) {
                        response.send(JSON.stringify([data.length, data1.length, data2.length]))
                    }
                })
            })
        })
    }
})

profileRequestsRouter.post("/userstatsc", (request, response) => {
    let userid = request.body.userid as string | null
    if (userid == "" || userid == null) {
        response.send("fail")
    } else {
        postsDb.find({ userid: userid }, (data: any, err: any) => {
            followersDb.find({ following: userid }, (data1: any, err1: any) => {
                followersDb.find({ userid: userid }, (data2: any, err2: any) => {
                    if (!err && !err1 && !err2) {
                        response.send(JSON.stringify([data.length, data1.length, data2.length]))
                    }
                })
            })
        })
    }
})

profileRequestsRouter.post("/getuserpfp", (request, response) => {
    let userid = request.cookies["semauser"] as string | null
    if (userid == "" || userid == null) {
        response.send("fail")
    } else {
        const profilePictures = fs.readdirSync(path.join('public', 'imgs', 'pfps'))
        const userProfilePicture = profilePictures.find(file => path.parse(file).name === userid)
        if (userProfilePicture == null) {
            response.send('imgs/default.png')
        } else {
            const userProfilePicturePath = `imgs/pfps/${userProfilePicture}`;
            response.send(userProfilePicturePath)
        }
    }
})

profileRequestsRouter.post("/getuserpfp/:id", (request, response) => {
    let userid = request.params.id as string | null
    const profilePictures = fs.readdirSync(path.join('public', 'imgs', 'pfps'))
    const userProfilePicture = profilePictures.find(file => path.parse(file).name === userid)
    if (userProfilePicture == null) {
        response.send('imgs/default.png')
    } else {
        const userProfilePicturePath = `imgs/pfps/${userProfilePicture}`;
        response.send(userProfilePicturePath)
    }
})


profileRequestsRouter.post("/updatepfp", async (request, response) => {
    let userid = request.cookies["semauser"] as string | null
    if (userid == "" || userid == null) {
        response.send("fail")
    } else {
        const base64Data = request.body.image;
        await uploadPfp(base64Data, userid).then((data) => {
            response.send(data)
        })
    }
})

profileRequestsRouter.post("/updateprofilenames", (request, response) => {
    let userid = request.cookies["semauser"] as string | null
    if (userid == "" || userid == null) {
        response.send("fail")
    } else {
        let dname = request.body.dname
        let username = request.body.username
        usersDb.update(
            { userid: userid },
            { dname: dname, username: username },
            false, (data:any, err:any) => {
            if (!err) response.send("done")
        })
    }
})


