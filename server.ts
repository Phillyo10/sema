import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'

// routes
import { logonRouter } from './routes/logon.js'
import { indexRequestsRouter } from './routes/indexrequests.js'
import { mainPagesRouter } from './routes/pages.js'
import { profileRequestsRouter } from './routes/profilerequests.js'
import { notificationsRouter } from './routes/notifications.js'
import { followStatesRouter } from './routes/followstates.js'

const app = express()

app.set("view engine", 'ejs')
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(express.json({ limit: '50mb' }))
app.use(cookieParser())

app.use("/", mainPagesRouter)
app.use("/", logonRouter)
app.use("/", indexRequestsRouter)
app.use("/", profileRequestsRouter)
app.use("/notify", notificationsRouter)
app.use("/follow", followStatesRouter)

app.listen(80)