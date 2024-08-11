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

let commentHtml = (user: any, userpfppath: string, comment: string, postowner: string) => {
    return `
    <div class="feed-comment">
        <div class="comment-owner">
            <div class="image"><img src="${userpfppath}" alt=""></div>
            <div class="userinfo">
                <div class="name"><a onclick="">${user.dname}</a> ${(user.verified) ? `<i class="bi bi-patch-check-fill"></i>`: ''}</div>
                <div class="reply">Replying to ${postowner}</div>
            </div>
        </div>
        <div class="comment">${comment}</div>
    </div>`
}

let postHtml = (user:UserAuth, post:Post, pfppath: string, poststats: number[], likecallback?: Function, repostcallback?: Function) => {
    return `
    <div class="feed-card">
        <div class="feed-owner">
            <div class="image"><img src="${pfppath}" alt=""></div>
            <div class="userinfo">
                <div class="name"><a onclick="">${user.dname}</a> ${(user.verified) ? `<i class="bi bi-patch-check-fill"></i>`: ''}</div>
                <div class="username">@${user.username}</div>
            </div>
            <div class="follow-action">
                <button class="solid-btn">Follow</button>
            </div>
        </div>
        <div class="feed-card-content">${post.post}</div>
        <div class="feed-date">${post.time} <i class="bi bi-dot"></i> ${post.date}</div>
        <div class="feed-actions">
            <div class="like-btn" data-postid="${post.postid}" data-likes="${poststats[0]}" onclick="likebutton(this)">${poststats[0]} <i class="fa-regular fa-heart"></i></div>
            <div class="comments-btn" data-postid="${post.postid}"  onclick="opencomments(this)">${poststats[1]} <i class="fa-regular fa-comment"></i></div>
            <div class="retw-btn" data-postid="${post.postid}" onclick="retwbutton(this)">${poststats[2]} <i class="fa-solid fa-rotate"></i></div>
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
    feedHeader.innerHTML = `
    <div class="feed-choice"><i class="fa-regular fa-face-smile"></i> For You</div>
    <div class="feed-choice selected"><i class="bi bi-broadcast"></i> Live Chat</div>`;
    loadFeed()
})

const searchbutton = document.querySelector<HTMLButtonElement>("#search-btn");
searchbutton?.addEventListener("click", () => {
    document.querySelector(".blank-btn.selected")?.classList.remove("selected")
    searchbutton.classList.add("selected")
    const feedHeader = document.querySelector("#feed-header");
    const feedContent = document.querySelector("#feed-content");
    if (feedHeader == null || feedContent == null) return
    feedHeader.innerHTML = `
    <input type="search" name="search" id="search-box" autocomplete="off" placeholder="What are you looking for? 👀">`;
    feedContent.innerHTML = ""
    document.querySelector<HTMLInputElement>("#search-box")?.focus()
})

const userProfileButton = document.querySelector<HTMLButtonElement>("#user-profile-btn");
userProfileButton?.addEventListener("click", () => window.location.assign("/myprofile"))




function likebutton(element: HTMLElement) {
    if (element.dataset == null || element.dataset.likes == null) return
    if (element.dataset.likes == "") return
    const elementdata = element.dataset
    const postid = element.dataset.postid
    element.classList.toggle("liked")
    if (element.classList.contains("liked")) {
        $.post("/togglelikepost", { like: true, postid: postid }, (data, status) => {
            if (elementdata == null || element.dataset.likes == null) return
            if (elementdata.likes == undefined) return
            const likes = parseInt(elementdata.likes)
            element.innerHTML = `${likes+1} <i class="fa-regular fa-heart"></i>`
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
    element.classList.toggle("retw")
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
        }, (data, status) => {
            if (data == "posted") {
                openCommentsButton.click();
                openCommentsButton.click();
                AlertMsg.show("good", "Comment Added!");
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
        console.log(comments)
        for (let i = 0; i < comments.length; i++) {
            const comment = comments[i]
            if (i == 0) feedComments.children[0].innerHTML = `
            <div class="add-comment">
                <div class="text">Join the conversation</div>
                <button class="grey-btn" onclick="addComment('${comment.postid}', this)"><i class="bi bi-chat"></i> Add a comment</div>
            </div>`;
            $.post("/getuser", { userid: comment.userid }, (data, status) => {
                $.post(`/getuserpfp/${comment.userid}`, {}, (userpfp, status) => {
                    if (userpfp == "fail") return
                    const user = JSON.parse(data)
                    feedComments.children[0].innerHTML += `${commentHtml(user, userpfp, comment.comment, username_ownerpost)}`
                })
            })
        }
    }
}

function loadFeed() {
    $.post("/allposts", {}, (data, status) => {
        if (data == "fail") return;
        const feedContent = document.querySelector<HTMLDivElement>("#feed-content")
        if (feedContent == null) return;
        feedContent.innerHTML = "";
        const posts: any[] = JSON.parse(data)

        for (let i = 0; i < posts.length; i++) {
            $.post("/getuser", { userid: posts[i].userid }, (userdata, status) => {
                if (userdata == "fail") return;

                const user: UserAuth = JSON.parse(userdata)
                const post: any = posts[i];

                const likes = post.likes.length
                const comments = post.comments.length
                const reposts = posts.reduce((total, value) => {
                    let additional = (value.repost == true && value.repostid == post.postid) ? 1 : 0
                    return total + additional
                }, 0)

                $.post(`/getuserpfp/${post.userid}`, {}, (pfppath, status) => {
                    feedContent.innerHTML += postHtml(user, post, pfppath, [likes, comments, reposts])
                })
            })

        }
    })
}

loadFeed()