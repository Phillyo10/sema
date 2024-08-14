
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

async function countUserNotifications() {
    return new Promise((resolve) => {
        $.post("/notify/countnotifications", {}, (data, status) => {
            resolve(parseInt(data))
        })
    })
}

async function readAllUserNotifications() {
    return new Promise((resolve) => {
        $.post("/notify/readall", {}, (data:any, status:any) => {
            (data) ? resolve(data) : resolve("fail")
        })
    })
}

async function getUserNotifications() {
    return new Promise((resolve) => {
        fetch("/notify/notifications").then((response) => {
            (response.ok) ? resolve(response.json()) : resolve("fail")
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

async function sendFollowUserNotification(following: any) {
    return new Promise((resolve) => {
        fetch("/notify/followuser", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userid: following }) 
        }).then((response: any) => {
            if (response.ok) resolve(true); else resolve(false)
        })
    })
}

async function sendUnFollowUserNotification(following: any) {
    return new Promise((resolve) => {
        fetch("/notify/unfollowuser", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userid: following }) 
        }).then((response: any) => {
            if (response.ok) resolve(true); else resolve(false)
        })
    })
}

async function followUser(following: string) {
    return new Promise((resolve) => {
        fetch("/follow/user", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ following: following }) 
        }).then( async (response: any) => {
            if (response.ok) {
                await sendFollowUserNotification(following)
                resolve(true);
            } else resolve(false)
        })
    })
}

async function unfollowUser(following: string) {
    return new Promise((resolve) => {
        fetch("/follow/unfuser", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ following: following }) 
        }).then( async (response: any) => {
            if (response.ok) {
                await sendUnFollowUserNotification(following)
                resolve(true);
            } else resolve(false)
        })
    })
}