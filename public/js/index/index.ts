type UserAuth = {
    userid: string,
    username: string,
    dname: string,
    password: string,
    pfp: string,
    verified: boolean
}

type Post = {
    postid: string,
    userid: string,
    post: string,
    time: string,
    date: string,
    repost: boolean,
    repostid: string
}

type PostComment = {
    post: Post,
    user: UserAuth,
    comment: string
}

let userProfileSearch = (user: UserAuth, userpfp: string) => {
    let html = `
    <div class="user-card" onclick="openUserProfile('${user.userid}')">
        <div class="image"><img src="${userpfp}" alt=""></div>
        <div class="userinfo">
            <div class="name">${user.dname} ${(user.verified) ? `<i class="bi bi-patch-check-fill"></i>`: ''}</div>
            <div class="username">@${user.username}</div>
        </div>
    </div>`;
    return html
}

let userProfileOvw = async (feedContent: HTMLElement, user: UserAuth, userpfp: string, userstats: any[], usercheck: boolean) => {
    let isfollowinguser: object | any = await isFollowing(user.userid)
    let followingButton = ""
    if (usercheck) {
        followingButton = `<button class="regular-btn" onclick="openMyProilePage()">My Profile</button>`
    } else {
        followingButton = (isfollowinguser.userid == null || isfollowinguser.userid == undefined) ? `<button class="follow-btn" onclick="toggleFollowUser(this, '${user.userid}')">Follow</button>` : `<button class="unfollow-btn" onclick="toggleFollowUser(this, '${user.userid}')">Following</button>`
    }
    let html = `
    <div class="profileovw">
        <div class="profile-bg"><img src="${userpfp}" id="pfp" alt="User Profile Picture"></div>
        <div class="profile-wrapper">
            <div class="profile-img">
                <img src="${userpfp}" id="pfp" alt="User Profile Picture">
            </div>
            <div class="userinfo">
                <div class="name" id="main-dname">${user.dname}</div>
                <div class="username" id="main-username">@${user.username}</div>
            </div>
            <div class="stats" id="stats">
                <div class="stat"><span class="value">${userstats[0]}</span> posts</div>
                <div class="stat"><span class="value">${userstats[1]}</span> Followers</div>
                <div class="stat"><span class="value">${userstats[2]}</span> Following</div>
            </div><br>
            ${followingButton}
        </div>
    </div>`;
    feedContent.innerHTML = html
}

let commentHtml = (user: UserAuth, userpfppath: string, comment: string, postowner: string) => {
    return `
    <div class="feed-comment">
        <div class="comment-owner"  onclick="openUserProfile('${user.userid}')">
            <div class="image"><img src="${userpfppath}" alt=""></div>
            <div class="userinfo">
                <div class="name"><a onclick="">${user.dname}</a> ${(user.verified) ? `<i class="bi bi-patch-check-fill"></i>`: ''}</div>
                <div class="reply">Replying to ${postowner}</div>
            </div>
        </div>
        <div class="comment">${comment}</div>
    </div>`
}

let postHtml = (user:UserAuth, post:Post, pfppath: string, poststats: number[], userliked: boolean, userreposted: boolean) => {
    return `
    <div class="feed-card">
        <div class="feed-owner" onclick="openUserProfile('${user.userid}')">
            <div class="image"><img src="${pfppath}" alt=""></div>
            <div class="userinfo">
                <div class="name"><a onclick="">${user.dname}</a> ${(user.verified) ? `<i class="bi bi-patch-check-fill"></i>`: ''}</div>
                <div class="username">@${user.username}</div>
            </div>
        </div>
        <div class="feed-card-content">${post.post}</div>
        <div class="feed-date">${post.time} <i class="bi bi-dot"></i> ${post.date}</div>
        <div class="feed-actions">
            <div class="like-btn ${(userliked) ? "liked" : ""}" data-postid="${post.postid}" data-likes="${poststats[0]}" onclick="likebutton(this)">${poststats[0]} <i class="fa-regular fa-heart"></i></div>

            <div class="comments-btn" data-postid="${post.postid}"  onclick="opencomments(this)">${poststats[1]} <i class="fa-regular fa-comment"></i></div>

            <div class="retw-btn ${(userreposted) ? "retw" : ""}" data-postid="${post.postid}" onclick="retwbutton(this)" data-retw="${poststats[2]}">${poststats[2]} <i class="fa-solid fa-rotate"></i></div>
        </div>
        <div class="feed-comments">
            <div class="add-comment">
                <div class="text">Join the conversation</div>
                <button class="grey-btn" onclick="addComment('${post.postid}', this)"><i class="bi bi-chat"></i> Add a comment</div>
            </div>
        </div>
    </div>
    `
}

let repostHtml = (user:UserAuth, post:Post, pfppath: string, poststats: number[], userliked: boolean, userreposted: boolean, repost: Post, repostuser: UserAuth, repostuserpfppath: string) => {
    return `
    <div class="feed-card">
        <div class="feed-owner" onclick="openUserProfile('${user.userid}')">
            <div class="image"><img src="${pfppath}" alt=""></div>
            <div class="userinfo">
                <div class="name"><a onclick="">${user.dname}</a> ${(user.verified) ? `<i class="bi bi-patch-check-fill"></i>`: ''}</div>
                <div class="username">@${user.username}</div>
            </div>
        </div>
        <div class="feed-card-content">
            ${post.post}
            <div class="repost-card full">
                <div class="profile" onclick="openUserProfile('${repostuser.userid}')">
                    <div class="image"><img src="${repostuserpfppath}" alt=""></div>
                    <div class="userinfo">
                        <div class="name">
                            ${repostuser.dname} ${(repostuser.verified) ? `<i class="bi bi-patch-check-fill"></i>`: ''}
                        </div>
                        <div class="username">@${repostuser.username}</div>
                    </div>
                </div>
                <div class="post">${repost.post}</div>
                ${(repost.post.split(" ").length >= 30) ? `
                <div class="size-control">
                    <a href="" style="color: blue;">
                        <i class="fa-solid fa-chevron-up"></i> Show Less
                    </a>
                </div>` : ""}
            </div>
        </div>

        <div class="feed-date"><span class="reposttxt">@${user.username} reposted!</span> <i class="bi bi-dot"></i> ${post.time} <i class="bi bi-dot"></i> ${post.date}</div>
        <div class="feed-actions">
            <div class="like-btn ${(userliked) ? "liked" : ""}" data-postid="${post.postid}" data-likes="${poststats[0]}" onclick="likebutton(this)">
                ${poststats[0]} <i class="fa-regular fa-heart"></i>
            </div>

            <div class="comments-btn" data-postid="${post.postid}" onclick="opencomments(this)">
                ${poststats[1]} <i class="fa-regular fa-comment"></i>
            </div>

            <div class="retw-btn ${(userreposted) ? "retw" : ""}" data-postid="${post.postid}" onclick="retwbutton(this)" data-retw="${poststats[2]}">
                ${poststats[2]} <i class="fa-solid fa-rotate"></i>
            </div>
        </div>

        <div class="feed-comments">
            <div class="add-comment">
                <div class="text">Join the conversation</div>
                <button class="grey-btn" onclick="addComment('${post.postid}', this)"><i class="bi bi-chat"></i> Add a comment</div>
            </div>
        </div>
    </div>`
}

const postButton = document.querySelector<HTMLButtonElement>("#makepost-btn");
postButton?.addEventListener("click", () => {
    document.querySelector(".blank-btn.selected")?.classList.remove("selected")
    postButton.classList.add("selected")
    let postmodal = new PostModal();
    postmodal.show((value: any) => {
        $.post("/createpost", {
            post: value
        }, (data, status) => {
            if (data == "done") AlertMsg.show("good", "Post Added!"); else AlertMsg.show("bad", "There was a issue in making your post")
            loadFeed()
        })
    })
})

const homebutton = document.querySelector<HTMLButtonElement>("#home-btn");
homebutton?.addEventListener("click", () => {
    document.querySelector(".blank-btn.selected")?.classList.remove("selected")
    homebutton.classList.add("selected")
    const feedHeader = document.querySelector("#feed-header");
    if (feedHeader == null) return
    feedHeader.innerHTML = `<div class="feed-choice"><i class="bi bi-broadcast"></i> Feed</div>`;
    loadFeed()
})

const notificationsbutton = document.querySelector<HTMLButtonElement>("#notifications-btn");
notificationsbutton?.addEventListener("click", async () => {
    document.querySelector(".blank-btn.selected")?.classList.remove("selected")
    notificationsbutton.classList.add("selected")

    await readAllUserNotifications()
    const notificationBanner = document.getElementById("notifs") as HTMLDivElement | any
    if (notificationBanner == null) return
    notificationBanner.style.display = "none"

    const feedContent = document.querySelector("#feed-content");
    const feedHeader = document.querySelector("#feed-header");

    if (feedHeader == null || feedContent == null) return
    feedHeader.innerHTML = `<div class="feed-choice"><i class="fa-solid fa-bell"></i> Notifications</div>`;
    feedContent.innerHTML = ""

    const notifications: any[] | any = await getUserNotifications()
    notifications.reverse()
    for (let i = 0; i < notifications.length; i++) {
        const notification = notifications[i];
        const notificationHtml = await SemaNotification.notify(notification.type, notification.taguserid, notification.time)
        feedContent.innerHTML += notificationHtml
    }
})

const searchbutton = document.querySelector<HTMLButtonElement>("#search-btn");
searchbutton?.addEventListener("click", () => {
    document.querySelector(".blank-btn.selected")?.classList.remove("selected")
    searchbutton.classList.add("selected")
    const feedHeader = document.querySelector("#feed-header");
    const feedContent = document.querySelector("#feed-content");
    if (feedHeader == null || feedContent == null) return
    feedHeader.innerHTML = `<input type="search" name="search" id="search-box" autocomplete="off" placeholder="What are you looking for? 👀">`;
    feedContent.innerHTML = ""
    
    const searchBox = document.querySelector<HTMLInputElement>("#search-box")
    if (searchBox == null) return
    searchBox.focus()
    searchBox.addEventListener("keyup", async () => {
        feedContent.innerHTML = ""
        const searchvalue = searchBox.value
        const results: any[] | any = await searchUsers(searchvalue)
        for (let i = 0; i < results.length; i++) {
            const user: UserAuth = results[i];
            const loggedinuser: boolean | any = await isLoggedOnUser(user.userid)
            if (loggedinuser) continue; else {
                const userpfp: string | any = await getUserPfp(user.userid)
                feedContent.innerHTML += userProfileSearch(user, userpfp)
            }
        }
    })
})

const openMyProilePage = () => { window.location.assign("/myprofile") }

const userProfileButton = document.querySelector<HTMLButtonElement>("#user-profile-btn");
userProfileButton?.addEventListener("click", openMyProilePage)


async function openUserProfile(userid: string) {
    const feedContent = document.querySelector("#feed-content") as HTMLElement;
    if (feedContent == null) return
    const user: UserAuth | any = await getUser(userid)
    const userPffStats: any[] | any = await getUserPFFStats(userid)
    const userpfp: string | any = await getUserPfp(userid)
    const checkUser: boolean | any = await isLoggedOnUser(userid)
    await userProfileOvw(feedContent, user, userpfp, userPffStats, checkUser)
    await loadUserPosts(user.userid)
}

async function toggleFollowUser(element: HTMLElement, userid: string) {
    if (element.classList.contains("follow-btn")) {
        element.setAttribute("class", "unfollow-btn")
        element.innerHTML = "Following"
        await followUser(userid)
    } else if (element.classList.contains("unfollow-btn")) {
        element.setAttribute("class", "follow-btn")
        element.innerHTML = "Follow"
        await unfollowUser(userid)
    }
}

function likebutton(element: HTMLElement) {
    if (element.dataset == null || element.dataset.likes == null) return
    if (element.dataset.likes == "") return
    const elementdata = element.dataset
    const postid = element.dataset.postid
    element.classList.toggle("liked")

    if (element.classList.contains("liked")) {
        $.post("/togglelikepost", { like: true, postid: postid }, async (data, status) => {
            if (elementdata == null || element.dataset.likes == null) return
            if (elementdata.likes == undefined) return
            const likes = parseInt(elementdata.likes)
            element.innerHTML = `${likes+1} <i class="fa-regular fa-heart"></i>`
            await sendLikePostNotification(postid)
        })
    } else {
        $.post("/togglelikepost", { like: false, postid: postid }, (data, status) => {
            if (elementdata == null || element.dataset.likes == null) return
            if (elementdata.likes == undefined) return
            const likes = parseInt(elementdata.likes)
            element.innerHTML = `${likes} <i class="fa-regular fa-heart"></i>`
        })
    }
}

function retwbutton(element: HTMLElement) {
    if (element.dataset == null || element.dataset.retw == null) return
    if (element.dataset.likes == "") return

    const postid = element.dataset.postid
    element.classList.toggle("retw")

    if (postid == "" || typeof postid !== "string") return
    if (element.classList.contains("retw")) {
        element.classList.toggle("retw")
        let repostmodal = new InputRepostModal();
        repostmodal.show(postid, async (value: any, postid: any, postowner: any) => {
            await makerepost(value, postid).then(async (data) => {
                if (data !== "fail") {
                    AlertMsg.show("good", `Reposted ${postowner}'s post!`)
                    await sendRePostNotification(postid)
                } else AlertMsg.show("bad", "Failed to repost!")
            })
        })
    }
}

function addComment(postid: string, element: HTMLElement) {
    let inputmodal = new InputModal();
    const feedcard = element.parentElement?.parentElement?.parentElement as HTMLElement | null
    if (feedcard == null) return
    if (feedcard.children == null) return
    
    const openCommentsButton = feedcard.children[3].children[1] as HTMLButtonElement
    inputmodal.show("Add a Comment", (value: string) => {
        $.post("/createpostcomment", {
            postid: postid,
            comment: value
        }, async (data, status) => {
            if (data == "posted") {
                openCommentsButton.click();
                openCommentsButton.click();
                AlertMsg.show("good", "Comment Added!");
                await sendCommentPostNotification(postid)
            }else AlertMsg.show("bad", "There was a issue in adding your comment")
        })
    })
}

async function loadComments(postid: string) {
    return new Promise((resolve, reject) => {
        $.post("/loadcomments", { postid: postid }, (data, status) => {
            if (data !== "fail") resolve(JSON.parse(data)); else reject("Fail")
        })
    })
}

async function opencomments(element: HTMLElement) {
    const postid = element.dataset.postid as string
    const feedcard = element.parentElement?.parentElement;
    feedcard?.classList.toggle("opencomments");
    if (feedcard?.classList.contains("opencomments")) {
        if (feedcard?.children[4] == null) return

        let username_ownerpost = feedcard?.children[0].children[1].children[1].innerHTML as string | null
        if (username_ownerpost == null || element.parentElement == null) return
        if (feedcard == null) return
        if (feedcard?.children == null) return
    
        const feedComments = feedcard.children[4];
        

        const comments: any = await loadComments(postid) as any[] | null
        for (let i = 0; i < comments.length; i++) {
            const comment = comments[i]
            if (i == 0) feedComments.innerHTML = `
            <div class="add-comment">
                <div class="text">Join the conversation</div>
                <button class="grey-btn" onclick="addComment('${comment.postid}', this)">
                    <i class="bi bi-chat"></i> Add a comment
                </button>
            </div>`;
            $.post("/getuser", { userid: comment.userid }, (data, status) => {
                $.post(`/getuserpfp/${comment.userid}`, {}, (userpfp, status) => {
                    if (userpfp == "fail") return
                    const user = JSON.parse(data)
                    feedComments.innerHTML += `${commentHtml(user, userpfp, comment.comment, username_ownerpost)}`
                })
            })
        }
    }
}

async function loadFeedPostInformation(feedContent: HTMLDivElement, posts: any, looppost: any) {
    return new Promise((resolve) => {
        $.post("/getuser", { userid: looppost.userid }, async (userdata, status) => {
            if (userdata == "fail") return;

            const user: UserAuth = JSON.parse(userdata)
            const post: any = looppost;

            const likes = post.likes.length
            const comments = post.comments.length

            let userliked: boolean = false
            for (let i = 0; i < post.likes.length; i++) {
                const user = post.likes[i];
                const checkUser = await isLoggedOnUser(user.userid)
                if (checkUser) {
                    userliked = true
                    break;
                } else userliked = false
            }
            
            const reposts = posts.reduce((total: any, value: any) => {
                let additional = (value.repost == true && value.repostid == post.postid) ? 1 : 0
                return total + additional
            }, 0)

            $.post(`/getuserpfp/${post.userid}`, {}, async (pfppath, status) => {
                if (post.repost == true) {
                    const repost: any = await getPost(post.repostid)
                    const repostuser: any = await getUser(repost.userid)
                    const repostuserpfppath: any = await getUserPfp(repost.userid)
                    const userreposted: boolean | any = await userReposted(post.postid)

                    feedContent.innerHTML += repostHtml(user, post, pfppath, [likes, comments, reposts], userliked, userreposted, repost, repostuser, repostuserpfppath)
                } else {
                    const userreposted: boolean | any = await userReposted(post.postid)
                    feedContent.innerHTML += postHtml(user, post, pfppath, [likes, comments, reposts], userliked, userreposted)
                }
            })

            resolve("done")
        })
    })
}

async function notificationChecker() {
    const notificationBanner = document.getElementById("notifs") as HTMLDivElement | any
    if (notificationBanner == null) return
    const nm: any = await countUserNotifications()
    if (nm > 0) {
        notificationBanner.style.display = "flex"
        notificationBanner.innerHTML = nm
    } else notificationBanner.style.display = "none"
}

function loadUserPosts(userid: string) {
    $.post("/alluserposts", { userid: userid }, async (data, status) => {
        if (data == "fail") return;

        const feedContent = document.querySelector<HTMLDivElement>("#feed-content")
        if (feedContent == null) return;

        const posts: any[] = JSON.parse(data)
        for (let i = 0; i < posts.length; i++) {
            await loadFeedPostInformation(feedContent, posts, posts[i])
        }
    })
}

function loadFeed() {
    $.post("/allposts", {}, async (data, status) => {
        if (data == "fail") return;

        const notificationBanner = document.getElementById("notifs") as HTMLDivElement | any
        if (notificationBanner == null) return
        const nm: any = await countUserNotifications()
        if (nm > 0) {
            notificationBanner.style.display = "flex"
            notificationBanner.innerHTML = nm
        } else notificationBanner.style.display = "none"

        const feedContent = document.querySelector<HTMLDivElement>("#feed-content")
        if (feedContent == null) return;
        feedContent.innerHTML = "";

        const posts: any[] = JSON.parse(data)
        for (let i = 0; i < posts.length; i++) {
            await loadFeedPostInformation(feedContent, posts, posts[i])
        }
    })
    setInterval(notificationChecker, 500)
}

loadFeed()