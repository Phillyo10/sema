
import Datastore from 'nedb'
import path from 'path'
import fs from 'fs'

class JsonDatabase {
    private filename: string;

    public constructor (filename: string) {
        this.filename = filename
    }

    public async find (filter: { [key: string]: any }, callback: Function) {
        const filecontents = fs.readFileSync(this.filename, 'utf8')
        const db = JSON.parse(filecontents)
        
        const foundIndexes = []
        for (let i = 0; i < db.length; i++) {
            const row: { [key: string]: any } = db[i];
            let found = false
            for (let key in row) {
                if (filter[key] == undefined) break
                if (row[key] == filter[key]) found = true; else {
                    found = false
                    break
                }
            }
            if (found) foundIndexes.push(i)
        }
        
        const result: any = []
        foundIndexes.forEach((value) => result.push(db[value]))
        console.log(result)
    }
}

const usersDb = new JsonDatabase(path.join("db", "users.json"))
usersDb.find({userid: "radars", ar: "ak27"}, (data: any, error: any) => console.log(data))
// export const postsDb = new Datastore({ filename: "db/posts.db", autoload: true })
// export const commentsDb = new Datastore({ filename: "db/comments.db", autoload: true })
// export const likesDb = new Datastore({ filename: "db/likes.db", autoload: true })