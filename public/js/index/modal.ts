
type AlertText = {
    title: string,
    text: string
}

interface User {
    userid: string,
    username: string,
    dname: string,
    password: string,
    verified: boolean
}

interface PostInfo {
    postid: string,
    userid: string,
    post: string,
    time: string,
    date: string,
    repost: boolean,
    repostid: string
}

class AlertModal {
    show(alerttext: AlertText, callback: Function) {
        let modal = document.getElementById("modal") as HTMLDivElement
        modal.innerHTML = `
        <div class="modal-alert-box">
            <div class="title">${alerttext.title}</div>
            <div class="text">${alerttext.text}</div>
            <div class="buttons">
                <button class="solid-btn" id="modalyesbtn">Yes</button>
                <button class="regular-btn" onclick="closeModal()">No</button>
            </div>
        </div>`;
        modal.classList.add("show")
        
        document.getElementById("modalyesbtn")?.addEventListener("click", () => {
            closeModal()
            callback()
        })
    }
}

class InputModal {
    show(title: string, callback: Function) {
        let modal = document.getElementById("modal") as HTMLDivElement
        modal.innerHTML = `
        <div class="modal-post-box">
            <div class="title">${title}</div>
            <div class="post-content">
                <textarea name="modalinput" id="modalinputtext" maxlength="280"></textarea>
            </div>
            <div class="buttons">
                <button class="solid-btn" id="modalpostbtn">Confirm</button>
                <button class="regular-btn" onclick="closeModal()">Cancel</button>
            </div>
        </div>`;
        modal.classList.add("show")
        
        document.getElementById("modalpostbtn")?.addEventListener("click", () => {
            const posttext = document.querySelector<HTMLTextAreaElement>("#modalinputtext");
            if (posttext?.value == "" || posttext == null) return
            closeModal()
            callback(posttext.value);
        })
    }
}

class ProfilePictureModal {
    pfppath: string;

    constructor (pfppath: string) {
        this.pfppath = pfppath;
    }

    show(callback: Function) {
        let modal = document.getElementById("modal") as HTMLDivElement
        modal.innerHTML = `
        <div class="modal-pfp-box">
            <div class="title">Profile Picture</div>
            <div class="profile-img">
                <label for="pfpupload">
                    <img src="${this.pfppath}" id="previewpfpimg">
                    <input type="file" name="pfpupload" id="pfpupload">
                </label>
            </div>
            <div class="buttons">
                <button class="solid-btn" id="modalpostbtn">Save</button>
                <button class="regular-btn" onclick="closeModal()">Cancel</button>
            </div>
        </div>`;
        modal.classList.add("show")

        document.querySelector<HTMLInputElement>("#pfpupload")?.addEventListener("change", (e) => {
            const input = e.target as HTMLInputElement
            if (!input || !input.files) return
            if (input == null || input.files == null) return
            const file = input.files[0];

            if (!file) return
            if (!file.type.startsWith("image/")) return
            const reader = new FileReader();
            reader.onload = e => {
                document.querySelector<HTMLImageElement>("#previewpfpimg")?.setAttribute(
                    "src", `${e.target?.result}`
                )
                const fileinputelement = document.querySelector<HTMLInputElement>("#pfpupload");
                if (!fileinputelement || fileinputelement == null) return
                fileinputelement.value = ""
            }
            reader.readAsDataURL(file);
        })
        
        document.getElementById("modalpostbtn")?.addEventListener("click", () => {
            const image = document.querySelector<HTMLImageElement>("#previewpfpimg")?.getAttribute("src")
            closeModal()
            callback(image);
        })
    }
}

class PostModal {
    show(callback: Function) {
        let modal = document.getElementById("modal") as HTMLDivElement
        modal.innerHTML = `
        <div class="modal-post-box">
            <div class="title">Make a Post</div><br>
            <div class="post-content">
                <div class="post" id="modalposttext" contenteditable placeholder="Whats up?"></div>
            </div>
            <div class="buttons">
                <button class="solid-btn" id="modalpostbtn">Post</button>
                <button class="regular-btn" onclick="closeModal()">Cancel</button>
            </div>
        </div>`;
        modal.classList.add("show")
        
        document.getElementById("modalpostbtn")?.addEventListener("click", () => {
            const posttext = document.querySelector<HTMLDivElement>("#modalposttext");
            if (posttext?.innerHTML == "" || posttext == null) return
            closeModal()
            callback(posttext.innerHTML);
        })
    }
}

function isPostInfo(obj: any): obj is PostInfo {
    return typeof obj === 'object' &&
           obj !== null &&
           typeof obj.userid === 'string' &&
           typeof obj.postid === 'string' &&
           typeof obj.post === 'string' &&
           typeof obj.time === 'string' &&
           typeof obj.date === 'string' &&
           typeof obj.repost === 'string' &&
           typeof obj.repostid === 'string';
}

function isUser(obj: any): obj is User {
    return typeof obj === 'object' &&
           obj !== null &&
           typeof obj.userid === 'string' &&
           typeof obj.username === 'string' &&
           typeof obj.dname === 'string' &&
           typeof obj.password === 'string' &&
           typeof obj.verified === 'boolean';
}

class InputRepostModal {
    async show(postid: string, callback: Function) {
        let modal = document.getElementById("modal") as HTMLDivElement
        const postinfo: PostInfo | unknown = await getPost(postid)
        if (typeof postinfo !== "object" || postinfo == null || !isPostInfo(postinfo)) return
        let postuserinfo = await getUser(postinfo.userid)
        if (!isUser(postuserinfo)) return
        
        modal.innerHTML = `
        <div class="modal-post-box repost">
            <div class="title">RePosting: ${postuserinfo.dname}'s Post</div><br>
            <div class="post-content">
                <div class="post" id="modalposttext" contenteditable placeholder="Whats up?"></div>
            </div>
            <div class="repost-container">
                <div class="profile">
                    <div class="image">
                        <img src="imgs/1.png" alt="">
                    </div>
                    <div class="userinfo">
                        <div class="name">hello</div>
                        <div class="username">@world</div>
                    </div>
                </div>
                <div class="content">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Animi, optio iusto rerum impedit quis, maxime et adipisci a sunt architecto aperiam laboriosam repellendus iste, quidem laudantium ab aut incidunt eligendi vero illum! Mollitia reiciendis et sint, nam optio laudantium quia veritatis distinctio similique cupiditate! Minima ratione quas corrupti facere nisi!</div>
            </div>
            <div class="buttons">
                <button class="solid-btn" id="modalpostbtn">Post</button>
                <button class="regular-btn" onclick="closeModal()">Cancel</button>
            </div>
        </div>`;
        modal.classList.add("show")
        
        document.getElementById("modalpostbtn")?.addEventListener("click", () => {
            const posttext = document.querySelector<HTMLDivElement>("#modalposttext");
            if (posttext?.innerHTML == "" || posttext == null) return
            closeModal()
            callback(posttext.innerHTML);
        })
    }
}

function closeModal() {
    let modal = document.getElementById("modal") as HTMLDivElement
    modal.classList.remove("show")
}