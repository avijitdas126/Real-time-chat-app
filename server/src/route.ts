import { clerkClient } from '@clerk/express'
import express, { Request, Response } from 'express'
import { addUser } from './db/action'
const router = express.Router()

router.get('/', (req: Request, res: Response) => {
    res.send("hello")
})

router.post('/addUser', async (req: Request, res: Response) => {
    const { userId, bio,firstName, lastName } = req.body
  console.log(req.body)
    try {
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                formCompleted: true
            }

        })
        let user = await clerkClient.users.getUser(userId)
        await clerkClient.users.updateUser(userId, { firstName,lastName })
        let avatar = user.imageUrl
        let email = user.emailAddresses[0]?.emailAddress
        addUser({ avatar, name:`${firstName} ${lastName}`, email, id: userId, bio })
        res.status(200).json({ success: true })
    } catch (error) {
        res.status(404).json({ success: false })
        console.log(error)
    }

})
export default router