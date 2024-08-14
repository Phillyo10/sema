const SemaNotification = {
    icons: {
        post: `<i class="fa-regular fa-square-plus"></i>`,
        repost: `<i class="fa-solid fa-rotate"></i>`,
        like: `<i class="fa-solid fa-heart"></i>`,
        follow: `<i class="fa-solid fa-user-plus"></i>`,
        unfollow: `<i class="fa-solid fa-user-minus"></i>`,
        comment: `<i class="fa-solid fa-comments"></i>`
    },
    texts: {
        post: " made a post",
        repost: " reposted your post",
        like: " liked your post",
        follow: " followed you",
        unfollow: " unfollowed you",
        comment: " commented on your post"
    },
    notify: async (type: "post" | "repost" | "like" | "follow" | "unfollow" | "comment", taguserid: any, time: number) => {
        const timeNow = Date.now()
        const user: object | any = await getUser(taguserid)
        let html = `
        <div class="notification ${type}">
            <div class="icon">${SemaNotification.icons[type]}</div>
            <div class="notification-content"><span class="taguser" onclick="openUserProfile('${taguserid}')">${user.dname}</span>${SemaNotification.texts[type]}. <span class="time">${formatTime(timeNow - time)}</span></div>
        </div>`;
        return html
    }
}