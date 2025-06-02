import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const genrateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })

  res.cookie('jwtToken', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //ms
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV !== 'devlopment',
  })
  return token
}
