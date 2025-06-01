import { response } from "express"
import { Webhook } from "svix"
import userModel from "../models/userModel.js"
import 'dotenv/config';


const clerkWebhooks = async (req, res) => {
    
    try {
        const Whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        await Whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        })

        const { data, type } = req.body

        switch (type) {
            case "user.created": {
                console.log('object')
                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url,
                }

                await userModel.create(userData)
                res.json({})
                break
            }

            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url,
                }

                await userModel.updateOne({ clerkId: data.id }, userData)
                res.json({})
                break
            }

            case "user.deleted": {
                await userModel.deleteOne({ clerkId: data.id })
                res.json({})
                break
            }

            default:
                break
        }

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

const userCredits = async (req,res) => {
  try {

    const {clerkId } = req.user

    const userData = await userModel.findOne({clerkId})

     res.json({ success:true,credits:userData.creditBalance })
    
   } catch (error) {
    console.error("Webhook error:", error)
    res.json({ success: false, message: error.message })
  }
 }

export { clerkWebhooks,userCredits }




// import { Webhook } from "svix"
// import userModel from "../models/userModel.js"

// const clerkWebhooks = async (req, res) => {
//   try {
//     const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

//     // Verify signature (no await needed)
//     wh.verify(JSON.stringify(req.body), {
//       "svix-id": req.headers["svix-id"],
//       "svix-timestamp": req.headers["svix-timestamp"],
//       "svix-signature": req.headers["svix-signature"],
//     })

//     const { data, type } = req.body

//     switch (type) {
//       case "user.created": {
//         const userData = {
//           clerkId: data.id,
//           email: data.email_addresses[0].email_address,
//           firstName: data.first_name,
//           lastName: data.last_name,
//           photo: data.image_url,
//         }

//         await userModel.create(userData)
//         res.sendStatus(201) // Created
//         break
//       }

//       case "user.updated": {
//         const userData = {
//           email: data.email_addresses[0].email_address,
//           firstName: data.first_name,
//           lastName: data.last_name,
//           photo: data.image_url,
//         }

//         await userModel.findOneAndUpdate({ clerkId: data.id }, userData, { new: true })
//         res.sendStatus(200)
//         break
//       }

//       case "user.deleted": {
//         await userModel.deleteOne({ clerkId: data.id })
//         res.sendStatus(200)
//         break
//       }

//       default:
//         res.status(400).json({ message: "Unhandled webhook event type" })
//         break
//     }
//   } catch (error) {
//     console.error("Webhook error:", error)
//     res.status(500).json({ success: false, message: error.message })
//   }
// }



// const userCredits = async (req,res) => {
//   try {

//     const{ clerkId } = req.body

//     const userData = await userModel.findOne({clerkId})

//     res.json({ success:true,credits:userData.creditBalance })
    
//   } catch (error) {
//     console.error("Webhook error:", error)
//     res.status(500).json({ success: false, message: error.message })
//   }
// }

// export { clerkWebhooks, userCredits }