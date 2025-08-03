import cloudinary from '../lib/cloudinary.js'
import { genrateToken } from '../lib/utils.js'
import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'

// signup
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body
  try {
    if (!fullName || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Required all feild',
      })
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be 6 characters',
      })
    }

    const user = await User.findOne({ email })
    if (user) {
      res.status(409).json({
        success: false,
        message: 'User already registered',
      })
    }

    const hashPassword = await bcryptjs.hash(password, 12)

    const newUser = new User({
      email,
      fullName,
      password: hashPassword,
    })

    if (newUser) {
      //genrate jwt
      genrateToken(newUser._id, res)
      await newUser.save()

      res.status(201).json({
        newUser,

        success: true,
        message: 'User created successfully',
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data',
      })
    }
  } catch (error) {
    console.log('Error in signup controller', error.message)
    res.status(500).json({
      success: false,
      message: `Internal server error ${error}`,
    })
  }
}

// login
export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Required all feild',
      })
    }
    const user = await User.findOne({ email })

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    const ispasswordCorrect = await bcryptjs.compare(password, user.password)

    if (!ispasswordCorrect) {
      res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    genrateToken(user._id, res)

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      password: user.password,
      profilepic: user.profilePic,
      email: user.email,
      success: false,
      message: 'Required all feild',
    })
  } catch (error) {
    console.log('error', error)

    res.status(500).json({
      success: false,
      message: `Internal server error${error}`,
    })
  }
}

// logout
export const logout = async (req, res) => {
  try {
    res.cookie('jwtToken', '', { maxAge: 0 })
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error ${error}`,
    })
  }
}

//update profile

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id
    const { profilePic } = req.body

    if (!profilePic) {
      res.status(400).json({
        success: false,
        message: `Profile pic required`,
      })
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic)

    if (!uploadResponse) {
      res.status(400).json({
        success: false,
        message: `Error in uploading image ${error}`,
      })
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    )

    return res.status(200).json({
      updatedUser,
      success: true,
      message: 'Profile Updated Successfully',
    })
  } catch (error) {
    console.log('error in update profile')

    res.status(500).json({
      success: false,
      message: `Internal server error ${error}`,
    })
  }
}

//check auth
export const checkAuth = async (req, res) => {
  try {
    const user = req.user
    res.status(200).json({ user, success: true, message: 'check auth user' })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error ${error}`,
    })
  }
}
