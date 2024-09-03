const User = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;
    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing!",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists!",
        success: false,
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashPassword,
      role,
    });

    return res.status(201).json({
      message: "Account created successfully!",
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing!!",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect credentials!!",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect credentials!!",
        success: false,
      });
    }
    // check role is correct or not
    if (role != user.role) {
      return res.status(400).json({
        message: "Account does not exist with current role",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullName}`,
        user,
        success: true,
      });
  } catch (err) {
    console.log(err);
  }
};

const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { magAge: 0 }).json({
      message: `Logged out successfully!`,
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    // if (!fullName || !email || !phoneNumber || !bio || !skills) {
    //   return res.status(400).json({
    //     message: "Something is missing!",
    //     success: false,
    //   });
    // }

    // cloudinary ayega idhar
    let skillsArray;
    if(skills){
      skillsArray = skills.split(",");
    }
    const userId  = req.id;  //middleware Authentication
    let user = await User.findById(userId);

    if(!user) {
        return res.status(400).json({
            message: 'User not found!!!',
            success: false,
        })
    }

    //updating data

    if(fullName) user.fullName = fullName; 
    if(email)  user.email= email; 
    if(phoneNumber) user.phoneNumber= phoneNumber; 
    if(bio) user.profile.bio= bio; 
    if(skillsArray) user.profile.skills= skillsArray; 
    

    // resume comes later here......

    await user.save();

    user = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile,
      };
      
      return res.status(200).json({
        message: `Profile updated successfully!`,
        user,
        success: true,
      })

  } catch (err) {
    console.log(err);
  }
};

module.exports = {register, login, logout, updateProfile};