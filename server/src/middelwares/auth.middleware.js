import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwtToken
    console.log('token:  ', token)
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized : no token provided',
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized access',
      })
    }

    const user = await User.findById(decoded.userId).select('-password')

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    req.user = user

    next()
  } catch (error) {
    console.log(`Internal server error ${error}`)

    res.status(200).json({
      success: false,
      message: `Internal server error ${error}`,
    })
  }
}
