const express = require("express");
const { Product } = require("../model/productmodel");

const productRouter = express.Router();
// Create Product
productRouter.post("/product/add", async (req, res) => {
  const {
    productName,
    description,
    sellingPrice,
    retailPrice,
    category_id,
    stock,
    imagesurl,
    hoverimg,
    colorShema,
    imagePath1color,
    imagePath2color,
    imagePath3color,
  } = req.body;

  if (
      productName==""||
      description==""||
      sellingPrice==""||
      retailPrice==""||
      category_id==""||
      stock==""||
      imagesurl==""||
      hoverimg==""||
      colorShema==""||
      imagePath1color==""||
      imagePath2color==""||
      imagePath3color==""
    
  ) {
    return res.status(401).send({
      status: false,
      type: "INVAL_id",
      error: "inval_id request body",
    });
  }
  try {
    const newProduct = new Product({
      productName,
      description,
      sellingPrice,
      retailPrice,
      imagesurl,
      hoverimg,
      category_id,
      stock,
      rate: 0,
      colorShema,
      rateCount: 0,
      rateTotal: 0,
    });
    await newProduct.save();
    res.status(200).send({ status: true, product: newProduct });
  } catch (error) {
    return res.status(401).send({
        status: false,
        type: "INVAL_id",
        error: "inval_id request body",
      });
  }  
});

// DELETE products.
productRouter.delete("/product/:_id", async (req, res) => {
  const { _id } = req.params;

  if (!_id) {
    return res.status(401).send({
      status: false,
      type: "INVAL_id",
      error: "Inval_id request parameter, _id",
    });
  }
  try {
    const product = await Product.findBy_idAndDelete(_id);
    if (!product) {
      return res.status(404).send({ status: false, error: "Inval_id request parameter, _id", });
    }
    return res.status(201).send({ status: true, _id });
  } catch (error) {
    return res
      .status(401)
      .send({ status: false, error });
  }
});

// GET all products
productRouter.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).send({ status: true, products:products });
  } catch (error) {
    return res
      .status(401)
      .send({ status: false, error });
  }
});

// GET a product
productRouter.get("/product/:_id", async (req, res) => {
  const { _id } = req.params;

  if (!_id) {
    return res.status(401).send({
      status: false,
      type: "INVAL_id",
      error: "Inval_id request parameter, _id",
    });
  }

  try {
    let product = await Product.findBy_id(_id); //Pass the _id of the product that is wanted
    if (!product) {
      throw Error(`no product found ${_id}`);
    }
    product = product.toObject();
    return res.status(200).send({ status: true, product });
  } catch (error) {
    return res
      .status(401)
      .send({ status: false, error});
  }
});

productRouter.patch("/product/update/:__id", async (req, res) => {
  const {__id} = req.params

  const {
    productName,
    description,
    sellingPrice,
    retailPrice,
    category_id,
    stock,
    hoverimg,
    colorShema,
    imagesurl,
  } = req.body;


  try {
    const updatedProduct = await Product.findBy_idAndUpdate(
      __id,
      {
        productName,
        description,
        sellingPrice,
        retailPrice,
        imagesurl,
        hoverimg,
        colorShema,
        category_id,
        stock,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).send({
        status: false,
        type: "NOT_FOUND",
        error: "Product not found",
      });
    }

    res.status(200).send({ status: true, product: updatedProduct });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: false,
      type: "SERVER_ERROR",
      error: "Internal server error"
    });
  }
});




module.exports = { productRouter };