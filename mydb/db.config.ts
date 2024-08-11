
import Datastore from 'nedb'
import path from 'path'
import fs from 'fs'

type TrueorFalse = true | false

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
        callback(result, false)
    }

    public async findOne (filter: { [key: string]: any }, callback: Function) {
        const filecontents = fs.readFileSync(this.filename, 'utf8')
        const db = JSON.parse(filecontents)
        
        let foundIndex = null
        for (let i = 0; i < db.length; i++) {
            const row: { [key: string]: any } = db[i];
            let found = false
            for (let key in row) {
                if (filter[key] == undefined) break
                if (row[key] == filter[key]) {
                    found = true;
                    break 
                } else found = false
            }
            if (found) foundIndex = i
        }
        
        if (foundIndex == null || foundIndex == undefined) callback(undefined, true); else callback(db[foundIndex], false)
    }

    
    public async insert (newitem: object, callback: Function) {
        const filecontents = fs.readFileSync(this.filename, 'utf8')
        const db: any[] = JSON.parse(filecontents)
        const currentlength: number = db.length
        if (db.push(newitem) > currentlength){
            fs.writeFileSync(this.filename, JSON.stringify(db), 'utf8')
            callback(true, false);
        } else callback(undefined, true)
    }

    public async update (find: object, setitem: object, multi: TrueorFalse,  callback: Function) {
        const filecontents = fs.readFileSync(this.filename, 'utf8')
        const db: any[] = JSON.parse(filecontents)

        if (multi === false) {
            this.findOne(find, (data: any, error: any) => {
                if (!error) {
                    callback(data, false)
                } else callback(undefined, true)
            })
        }

    }
}

const usersDb = new JsonDatabase(path.join("db", "users.json"))
// usersDb.find({userid: "radars", ar: "ak27"}, (data: any, error: any) => console.log(data))
// usersDb.insert({userid: "white cat", ar: "ak07", version: "1.0"}, (data: any, error: any) => console.log(data))
usersDb.update(
    {userid: "white cat", ar: "ak07", version: "1.0"}, 
    {ar: "ak100"}, 
    false, 
    (data: any, error: any) => console.log(data)
)
// export const postsDb = new Datastore({ filename: "db/posts.db", autoload: true })
// export const commentsDb = new Datastore({ filename: "db/comments.db", autoload: true })
// export const likesDb = new Datastore({ filename: "db/likes.db", autoload: true })