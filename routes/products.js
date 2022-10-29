const {Product} = require('../models/product')
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');

router.get(`/`, async (req, res) => {
    //localhost:3000/api/v1/products?category=1234abcd
    let filter = {};
    if(req.query.category){
        filter = {category: req.query.category.split(',')}
    }
    const productList = await Product.find(filter).populate('category');

    if(!productList){
        res.status(500).json({success: false});
    }
    res.send(productList);
})

router.get(`/:id`, async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');

    if(!product){
        res.status(500).json({success: false});
    }
    res.send(product);
})

router.post(`/`, async (req, res) =>{
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('danh muc san pham khong xac dinh')

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })

    product = await product.save();

    if(!product) 
    return res.status(500).send('khong tao duoc san pham')

    res.send(product);
})

router.put('/:id', async(req, res)=> {
    if(!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('id san pham khong hop le')
     }
 

    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('danh muc san pham khong xac dinh')

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        { new: true}
    )

    if(!product)
    return res.status(500).send('khong update duoc san pham!')

    res.send(product);
})

router.delete('/:id', (req, res) =>{
    Product.findByIdAndRemove(req.params.id).then(product =>{
        if(product){
            return res.status(200).json({success: true, message: "da xoa san pham"})
        } else {
            return res.status(404).json({success: false, message: "ko tim thay san pham"})
        }

    }).catch(err => {
        return res.status(500).json({success: false, error: err})
    })
})


router.get(`/get/count`, async (req, res) =>{
    const productCount = await Product.countDocuments();

    if(!productCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        productCount: productCount
    });
})



module.exports = router;