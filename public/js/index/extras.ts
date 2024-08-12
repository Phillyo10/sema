
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