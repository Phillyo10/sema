
async function getPost(postid: string) {
    return new Promise((resolve) => {
        $.post(`/getpost/${postid}`, {}, (data, status) => {
            resolve(JSON.parse(data))
        })
    })
}

async function getUser(userid: string) {
    return new Promise((resolve) => {
        $.post(`/getuser`, { userid: userid }, (data, status) => {
            resolve(JSON.parse(data))
        })
    })
}

async function getUserPfp(userid: string) {
    return new Promise((resolve) => {
        $.post(`/getuserpfp/${userid}`, {}, (data, status) => {
            resolve(data)
        })
    })
}

async function makerepost(post: any, postid: any) {
    return new Promise((resolve) => {
        $.post(`/createrepost`, {
            post: post,
            repostid: postid
        }, (data, status) => {
            resolve(data)
        })
    })
}

async function sendRePostNotification(postid: any) {
    return new Promise((resolve) => {
        fetch("/notify/repost", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postid: postid }) 
        }).then((response: any) => {
            if (response.ok) resolve(true); else resolve(false)
        })
    })
}

async function sendLikePostNotification(postid: any) {
    return new Promise((resolve) => {
        fetch("/notify/likepost", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postid: postid }) 
        }).then((response: any) => {
            if (response.ok) resolve(true); else resolve(false)
        })
    })
}

async function sendCommentPostNotification(postid: any) {
    return new Promise((resolve) => {
        fetch("/notify/commentpost", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postid: postid }) 
        }).then((response: any) => {
            if (response.ok) resolve(true); else resolve(false)
        })
    })
}