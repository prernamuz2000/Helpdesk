
const Category = require('../models/category');


const allCategory = async (req, res) => {
  try {


    const category = await Category.find();
    console.log(category);
     return res.send(category);
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    res.status(400).send(error);
  }
};
module.exports = allCategory;

