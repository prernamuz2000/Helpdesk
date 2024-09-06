const DepartmentEmails = require("../models/departmentalEmails");

// Update all department emails
const updateAllDepartmentEmails = async (updates) => {
  try {
    const results = await Promise.all(
      Object.entries(updates).map(([department, { headEmails, subcategories }]) =>
        DepartmentEmails.findOneAndUpdate(
          { department },
          { headEmails, subcategories },
          { new: true, upsert: true } // Return the updated document; create if it doesn't exist
        )
      )
    );
    console.log("Updated emails Succesfully");
    return results;
  } catch (error) {
    console.error("Error updating emails:", error);
    throw error; // Re-throw the error for handling in the calling function
  }
};

// Function to update emails with predefined updates
const updateEmails = async () => {
  // Define the updates
  const updates = {
    Admin: {
      headEmails: [
        { name: "Admin Head 1", email: "adminhead1@example.com" },
        { name: "Admin Head 2", email: "adminhead2@example.com" },
      ],
      subcategories: [
        {
          name: "Toilet",
          staffEmails: [
            { name: "Toilet Staff 1", email: "toiletstaff1@example.com" },
            { name: "Toilet Staff 2", email: "toiletstaff2@example.com" },
            { name: "Toilet Staff 3", email: "toiletstaff3@example.com" },
            { name: "Toilet Staff 4", email: "toiletstaff4@example.com" },
          ],
        },
        {
          name: "AC",
          staffEmails: [
            { name: "AC Staff 1", email: "acstaff1@example.com" },
            { name: "AC Staff 2", email: "acstaff2@example.com" },
            { name: "AC Staff 3", email: "acstaff3@example.com" },
            { name: "AC Staff 4", email: "acstaff4@example.com" },
          ],
        },
        {
          name: "Electricity",
          staffEmails: [
            { name: "Electricity Staff 1", email: "electricitystaff1@example.com" },
            { name: "Electricity Staff 2", email: "electricitystaff2@example.com" },
            { name: "Electricity Staff 3", email: "electricitystaff3@example.com" },
            { name: "Electricity Staff 4", email: "electricitystaff4@example.com" },
          ],
        },
        {
          name: "Desk cleanliness",
          staffEmails: [
            { name: "Desk Cleanliness Staff 1", email: "deskstaff1@example.com" },
            { name: "Desk Cleanliness Staff 2", email: "deskstaff2@example.com" },
            { name: "Desk Cleanliness Staff 3", email: "deskstaff3@example.com" },
            { name: "Desk Cleanliness Staff 4", email: "deskstaff4@example.com" },
          ],
        },
        {
          name: "Spillage",
          staffEmails: [
            { name: "Spillage Staff 1", email: "spillagestaff1@example.com" },
            { name: "Spillage Staff 2", email: "spillagestaff2@example.com" },
            { name: "Spillage Staff 3", email: "spillagestaff3@example.com" },
            { name: "Spillage Staff 4", email: "spillagestaff4@example.com" },
          ],
        },
      ],
    },
    HR: {
      headEmails: [
        { name: "HR Head 1", email: "hrhead1@example.com" },
        { name: "HR Head 2", email: "hrhead2@example.com" },
      ],
      subcategories: [
        {
          name: "Salary",
          staffEmails: [
            { name: "Salary Staff 1", email: "salarystaff1@example.com" },
            { name: "Salary Staff 2", email: "salarystaff2@example.com" },
            { name: "Salary Staff 3", email: "salarystaff3@example.com" },
            { name: "Salary Staff 4", email: "salarystaff4@example.com" },
          ],
        },
        {
          name: "Attendance",
          staffEmails: [
            { name: "Attendance Staff 1", email: "attendancestaff1@example.com" },
            { name: "Attendance Staff 2", email: "attendancestaff2@example.com" },
            { name: "Attendance Staff 3", email: "attendancestaff3@example.com" },
            { name: "Attendance Staff 4", email: "attendancestaff4@example.com" },
          ],
        },
        {
          name: "Harassment",
          staffEmails: [
            { name: "Harassment Staff 1", email: "harassmentstaff1@example.com" },
            { name: "Harassment Staff 2", email: "harassmentstaff2@example.com" },
            { name: "Harassment Staff 3", email: "harassmentstaff3@example.com" },
            { name: "Harassment Staff 4", email: "harassmentstaff4@example.com" },
          ],
        },
      ],
    },
    IT: {
      headEmails: [
        { name: "IT Head 1", email: "ithead1@example.com" },
        { name: "IT Head 2", email: "ithead2@example.com" },
      ],
      subcategories: [
        {
          name: "Internet",
          staffEmails: [
            { name: "Internet Staff 1", email: "internetstaff1@example.com" },
            { name: "Internet Staff 2", email: "internetstaff2@example.com" },
            { name: "Internet Staff 3", email: "internetstaff3@example.com" },
            { name: "Internet Staff 4", email: "internetstaff4@example.com" },
          ],
        },
        {
          name: "Laptop issue",
          staffEmails: [
            { name: "Kajal IT", email: "kajalbhary@gmail.com" },
            { name: "Arun IT", email: "codingwithanu@gmail.com" },
            { name: "Laptop Staff 3", email: "laptopstaff3@example.com" },
            { name: "Laptop Staff 4", email: "laptopstaff4@example.com" },
          ],
        },
        {
          name: "Desktop",
          staffEmails: [
            { name: "Desktop Staff 1", email: "desktopstaff1@example.com" },
            { name: "Desktop Staff 2", email: "desktopstaff2@example.com" },
            { name: "Desktop Staff 3", email: "desktopstaff3@example.com" },
            { name: "Desktop Staff 4", email: "desktopstaff4@example.com" },
          ],
        },
        {
          name: "Biometric Attendance",
          staffEmails: [
            { name: "Biometric Attendance Staff 1", email: "biometricstaff1@example.com" },
            { name: "Biometric Attendance Staff 2", email: "biometricstaff2@example.com" },
            { name: "Biometric Attendance Staff 3", email: "biometricstaff3@example.com" },
            { name: "Biometric Attendance Staff 4", email: "biometricstaff4@example.com" },
          ],
        },
      ],
    },
  };

  // Update all department emails
  return updateAllDepartmentEmails(updates); // Return the promise for handling in the calling function
};

module.exports = { updateEmails };
