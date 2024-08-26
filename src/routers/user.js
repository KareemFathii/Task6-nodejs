
const express = require ('express')
const User = require('../models/user')
const auth = require('../../Middleware/auth')


const router = express.Router()


router.post ('/users' , async (req , res) => {
    console.log(req.body)

    const user = new User (req.body)
    // const token = await User.generateToken()
    await user.save()
    .then ((user) => {res.status(200).send(user)})
    .catch((e)=>{ res.status(400).send(e)})
})
///////////////////////////////////////////////////////////////////////////////////////////
// get 
router.get('/users',auth,(req,res)=>{
    User.find({}).then((users)=>{
        res.status(200).send(users)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})
////////////////////////////////////////////////////////////////////////////////////////////
// to get by id 

router.get('/users/:id',auth,(req,res)=>{
    console.log(req.params)
    const _id = req.params.id
    User.findById(_id).then((user)=>{
        if(!user){
           return res.status(404).send('Unable to find user')
        }
        res.status(200).send(user)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})
////////////////////////////////////////////////////////////////////////////////////////////
// patch 

router.patch('/users/:id',auth,async(req,res)=>{
    try{

        const updates = Object.keys (req.body)
        // console.log(updates)

        const _id = req.params.id

        // const user = await User.findByIdAndUpdate(_id,req.body,{
        //     new:true,
        //     // res.send  القديمه 
        //     runValidators:true
        //     // مش هيطبق الشروط اللى ف الموديل 
        // })

        const user = await User.findById (_id)
        if(!user){
            return res.status(404).send('No user is found')
        }

        updates.forEach((ele) => (user[ele] = req.body[ele]))

        // user.age = req.body.age
        // user.username = req.body.username
        // user.city = req.body.city
        // user.password = req.body.password

        // person = {
        //     age : 26,
        //     city : "mansoura"
        // }

        // person.    //  . notation 

        // person[]  // braket notation 

        /*
            ['age' , 'password']

            user[age] = req.body[age]  
        */
       await user.save()


        res.status(200).send(user)
    }
    catch(error){
        res.status(400).send(error)
    }
})



/////////////////////////////////////////////////////////////////////////////////////////////
// delete 


router.delete('/users/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const user = await User.findByIdAndDelete(_id)
        if(!user){
           return res.status(404).send('Unable to find user')
        }
        res.status(200).send(user)
    }
    catch(e){
        res.status(500).send(e)
    }
    })
/////////////////////////////////////////////////////////////////////////////////////////////

// login : 
router.post('/login',async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateToken()
        res.status(200).send({ user , token})
    }
    catch(e){
        res.status(400).send(e.message)
    }
})
/////////////////////////////////////////////////////////////////////////////////////////////
// router.post('/users',async(req,res)=>{
//     try{
//         const user = new User(req.body);
//         const token = await User.generateToken()
//         res.status(200).send({user, token})
//     }
//     catch(e){
//         res.status(400).send(e.message)
//     }
// })
////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/profile',auth ,async (req,res)=>{
        res.status(200).send(req.user);
})

////////////////////////////////////////////////////////////////////////////////////////////
router.delete('/logout' , auth ,async (req,res) =>{
    try{
        req.user.tokens = req.user.tokens.filter((tok)=> {return tok !== req.token})
        await req.user.save()
         res.status(200).send('Logged out')
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.delete('/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send(e)
    }
})



/////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router 
