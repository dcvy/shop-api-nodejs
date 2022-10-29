const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get(`/`, async (req, res) =>{
    const userList = await User.find().select('-passwordHash');

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.send(userList);
})

router.get('/:id', async(req, res) =>{
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user) {
        res.status(500).json({message:'ko tim thay user voi id nay'})
    }
    res.status(200).send(user);
})

router.post('/', async (req, res) =>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,

    })
    user = await user.save();

    if(!user)
    return res.status(404).send('chua tao duoc user');

    res.send(user);
})

router.post('/login', async (req,res) => {
    const user = await User.findOne({email: req.body.email})
    const secret = process.env.secret;
    if(!user) {
        return res.status(400).send('khong tim thay user');
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {expiresIn : '1d'}
        )
       
        res.status(200).send({user: user.email , token: token}) 
    } else {
       res.status(400).send('sai mat khau!');
    }

    router.post('/register', async (req,res)=>{
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        })
        user = await user.save();
    
        if(!user)
        return res.status(400).send('khong tao duoc user!')
    
        res.send(user);
    })


    router.get(`/get/count`, async (req, res) =>{
        const userCount = await User.countDocuments()
    
        if(!userCount) {
            res.status(500).json({success: false})
        } 
        res.send({
            userCount: userCount
        });
    })

    router.delete('/:id', (req, res) =>{
        User.findByIdAndRemove(req.params.id).then(user =>{
            if(user){
                return res.status(200).json({success: true, message: "da xoa user"})
            } else {
                return res.status(404).json({success: false, message: "ko tim thay user"})
            }
    
        }).catch(err => {
            return res.status(500).json({success: false, error: err})
        })
    })
    
    
    
})


module.exports =router;