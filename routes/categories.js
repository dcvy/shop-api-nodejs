const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const categoryList = await Category.find();

    if(!categoryList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(categoryList);
})

router.get('/:id', async(req, res) =>{
    const category = await Category.findById(req.params.id);

    if(!category) {
        res.status(500).json({message:'ko tim thay danh muc san pham voi id nay'})
    }
    res.status(200).send(category);
})

router.post('/', async (req, res) =>{
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color

    })
    category = await category.save();

    if(!category)
    return res.status(404).send('chua tao duoc danh muc san pham')

    res.send(category);
})

router.put('/:id', async(req, res)=> {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,
        },
        { new: true}

    )

    if(!category)
    return res.status(404).send('chua tao duoc danh muc san pham')

    res.send(category);
})

router.delete('/:id', (req, res) =>{
    Category.findByIdAndRemove(req.params.id).then(category =>{
        if(category){
            return res.status(200).json({success: true, message: "da xoa danh muc san pham"})
        } else {
            return res.status(404).json({success: false, message: "ko tim thay danh muc san pham"})
        }

    }).catch(err => {
        return res.status(500).json({success: false, error: err})
    })
})

module.exports =router;