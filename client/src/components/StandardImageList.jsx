import * as React from 'react'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import chat from '../assets/chat.svg'
import connect from '../assets/connect.svg'
import emailcap from '../assets/emailcap.svg'
import marketing from '../assets/marketing.svg'
import monusers from '../assets/monusers.svg'
import people from '../assets/people.svg'
import swipe from '../assets/swipe.svg'
import userchat from '../assets/userchat.svg'
import fingerprint from '../assets/fingerprint.svg'

export default function StandardImageList({ className = '', title, subtitle }) {
  return (
    <ImageList
      sx={{ width: 500, height: 500 }}
      cols={3}
      rowHeight={164}
      border={2}
    >
      {itemData.map((item) => (
        <ImageListItem
          key={item.img}
          className="overflow-hidden rounded-lg transition-transform hover:scale-102  border-1 border-[#605dff] "
        >
          <img
            srcSet={`${item.img}`}
            src={`${item.img}`}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover p-0.2"
          />
        </ImageListItem>
      ))}
    </ImageList>
  )
}

const itemData = [
  {
    img: chat,
    title: 'chat',
  },
  {
    img: connect,
    title: 'connect',
  },
  {
    img: marketing,
    title: 'Camera',
  },
  {
    img: emailcap,
    title: 'Coffee',
  },
  {
    img: fingerprint,
    title: 'Mushrooms',
  },
  {
    img: people,
    title: 'Hats',
  },
  {
    img: swipe,
    title: 'Honey',
  },
  {
    img: userchat,
    title: 'Basketball',
  },
  {
    img: monusers,
    title: 'Fern',
  },
]
