const mongoose = require('mongoose');
const UserInfo = require('../modals/userInfo');
const RegisterUser = require('../modals/registerUser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path'); // To manage file paths
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const secretKey = process.env.JWT_SECRET

const transporter = nodemailer.createTransport({
  service: "gmail", // Change this to your email service provider
  auth: {
    user: "kartik.kumar@rmoneyindia.com", // Replace with your email
    pass: "dcbe thrd ftje ngnr" // Replace with your email password or app-specific password
  }
});


exports.get = async (req, res) => {
  try {
    // Find all users in the 'User' collection
    const users = await UserInfo.find();

    // Check if there are no users found
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    // Return the list of users
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (e) {
    // Handle errors
    res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    // Find all users in the 'User' collection
    const users = await RegisterUser.find();

    // Check if there are no users found
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    // Return the list of users
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (e) {
    // Handle errors
    res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

exports.post = async (req, res) => {
  try {
    // Get data from the request body
    const { firstName, lastName, email, timeTaken } = req.body;

    // Create a new instance of the User model
    const newUser = new UserInfo({
      firstName,
      lastName,
      email,
      timeTaken
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with success message
    res.status(201).json({
      success: true,
      message: "User data saved successfully",
      data: newUser
    });

  } catch (e) {
    // Handle errors and respond with error message
    res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

exports.exportToExcel = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await UserInfo.find();

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found in the database.",
      });
    }

    // Prepare data for the Excel file
    const userData = users.map((user) => ({
      'First Name': user.firstName,
      'Last Name': user.lastName,
      'Email': user.email,
      'Time Taken': user.timeTaken,
      'Created At': user.createdAt,
      'Updated At': user.updatedAt,
    }));

    // Create a new workbook
    const worksheet = XLSX.utils.json_to_sheet(userData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    // Write workbook to buffer
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    // Set response headers for download
    res.setHeader("Content-Disposition", "attachment; filename=Report.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    // Send the buffer as a response (this will trigger the download)
    res.send(buffer);

  } catch (e) {
    // Handle errors
    console.error("Error occurred while exporting to Excel:", e);
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.registerEmail = async (req, res) => {
  
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required." });
  }

  try {
    // Generate JWT token
    // const token = jwt.sign({ email }, "secretKey", { expiresIn: "1h" });
    const token = Math.floor(100000 + Math.random() * 900000); // Random 6-digit number
    // const token = uuidv4();

    // Create a new user entry with email and JWT token
    const newUser = new RegisterUser({
      email: email,
      accessToken: token,
    });

    await newUser.save();

    const mailOptions = {
      from: "kartik.kumar@rmoneyindia.com",
      to: email,
      subject: "Your Access Token",
      text: `Hello,\n\nHere is your access token: ${token}\nPlease keep it secure and do not share it with anyone.\n\nBest regards,\nRmoney India`
    };
    
    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "User registered successfully. Token sent to email."
    });

  } catch (error) {
    console.error("Error in registering user and sending email:", error.message);

    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Email or Token already exists" });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

exports.authenticateEmail = async (req, res) => {
  const { email, accessToken } = req.body;

  if (!email || !accessToken) {
    return res.status(400).json({ success: false, message: "Email and Access Token are required." });
  }

  try {
    // Find the user in the database
    const user = await RegisterUser.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // // Verify the JWT token
    // jwt.verify(accessToken, "secretKey", async (err, decoded) => {
    //   if (err) {
    //     return res.status(401).json({ success: false, message: "Invalid or expired token." });
    //   }

    //   // If the token is valid, delete the user entry
    //   await RegisterUser.deleteOne({ email });

    //   res.status(200).json({ success: true, message: "Authentication successful! Access granted." });
    // });

    // Check if the provided token matches the stored one
    
    if (user.accessToken !== accessToken) {
      console.log("here");
      
      return res.status(401).json({ success: false, message: "Invalid token." });
    }

    // Delete the user entry after successful authentication
    await RegisterUser.deleteOne({ email });
    
    res.status(200).json({ success: true, message: "Authentication successful! Access granted." });

  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};