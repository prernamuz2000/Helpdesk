const DepartmentEmails = require('../models/departmentalEmails');

// Function to get emails by category and subcategory
const getEmailsByCategoryAndSubcategory = async (category, subcategory) => {
  const department = await DepartmentEmails.findOne({ department: category });

  if (!department) {
    return { headEmails: [], staffEmails: [] };
  }

  const subcategoryData = department.subcategories.find(
    (sub) => sub.name === subcategory
  );

  return {
    headEmails: department.headEmails,
    staffEmails: subcategoryData ? subcategoryData.staffEmails : []
  };
};

// Controller function to handle the GET request
const fetchEmails = async (req, res) => {
  const { category, subcategory } = req.query;

  if (!category || !subcategory) {
    return res.status(400).json({ error: 'Category and subcategory are required.' });
  }

  const emails = await getEmailsByCategoryAndSubcategory(category, subcategory);
  res.json(emails);
};

module.exports = {
  fetchEmails
};
