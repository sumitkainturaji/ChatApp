import cloudinary from '../lib/cloudinary.js'
import { getReceiverSocketId, io } from '../lib/socket.js'
import Message from '../models/message.model.js'
import User from '../models/user.model.js'

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select('-password')

    res.status(200).json(filteredUsers)
  } catch (error) {
    console.log('Message controller error', error)

    res.status(500).json({
      success: false,
      message: `Internal server error ${error}`,
    })
  }
}

//message controller

export const getMessages = async (req, res) => {
  try {
    const myId = req.user._id
    const { id: userChatId } = req.params

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userChatId },
        { senderId: userChatId, receiverId: myId },
      ],
    })

    res.status(200).json(messages)
  } catch (error) {
    console.log('getmessage error', error)
    res.status(500).json({
      success: false,
      message: `Internal server error ${error}`,
    })
  }
}

// send message

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body
    const { id: receiverId } = req.params
    const myId = req.user._id

    let imageUrl
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image)
      imageUrl = uploadResponse.secure_url
    }

    const newMessage = await Message.create({
      senderId: myId,
      receiverId,
      text,
      image: imageUrl,
    })

    if (!newMessage) {
      res.status(400).json({
        success: false,
        message: `message not sent `,
      })
    }

    const receiverSocketId = getReceiverSocketId(receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage)
    }

    res.status(201).json({ newMessage, success: true, message: 'Message sent' })
    // res.status(201).json(newMessage)
  } catch (error) {
    console.log('sendmassage error', error)

    res.status(500).json({
      success: false,
      message: `Internal server error ${error}`,
    })
  }
}
