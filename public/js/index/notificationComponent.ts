

const SemaNotification = {
    icons: {
        post: `<i class="fa-regular fa-square-plus"></i>`,
        repost: `<i class="fa-solid fa-rotate"></i>`,
        like: `<i class="fa-solid fa-heart"></i>`,
        follow: `<i class="fa-solid fa-user-plus"></i>`,
        unfollow: `<i class="fa-solid fa-user-minus"></i>`,
        comment: `<i class="fa-solid fa-comments"></i>`
    },
    notify: (type: "post" | "repost" | "like" | "follow" | "unfollow" | "comment", taguserid: any) => {
        let html = `
        <div class="notification ${type}">
            <div class="icon">${SemaNotification.icons[type]}</div>
            <div class="notification-content"><span class="taguser" onclick="openUserProfile('${taguserid}')">Dickson</span> unfollowed you. <span class="time">10h ago</span></div>
        </div>`;
    }
}