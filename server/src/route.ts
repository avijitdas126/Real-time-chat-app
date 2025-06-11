import { clerkClient } from '@clerk/express'
import express, { Request, Response } from 'express'
import { addUser, getUser, updateUser } from './db/action'
const router = express.Router()

router.get('/', (req: Request, res: Response) => {
    res.status(200).send("Ok. I am good")
})

router.post('/addUser', async (req: Request, res: Response) => {
    const { userId, bio, firstName, lastName } = req.body
    try {
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                formCompleted: true
            }

        })
        let user = await clerkClient.users.getUser(userId)
        await clerkClient.users.updateUser(userId, { firstName, lastName })
        let avatar = user.imageUrl
        let email = user.emailAddresses[0]?.emailAddress
        addUser({ avatar, name: `${firstName} ${lastName}`, email, id: userId, bio })
        res.status(200).json({ success: true })
    } catch (error) {
        res.status(404).json({ success: false })
        console.log(error)
    }

})
router.post('/getprofile', async (req: Request, res: Response) => {
    const { id } = req.body
    try {
        const user = await getUser(id)
        res.status(200).json({ user })
    } catch (error) {
        res.status(404).json({ success: false })
        console.log(error)
    }
})
router.post('/updateprofile', async (req: Request, res: Response) => {
    const { id,bio,avatar,phone_no } = req.body
    try {
        const user = await updateUser(id,bio,avatar,phone_no)
        res.status(200).json({ user })
        console.log(user)
    } catch (error) {
        res.status(404).json({ success: false })
        console.log(error)
    }
})
export default router