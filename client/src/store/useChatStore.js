import { create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'
import { userAuthStore } from './userAuthStore'
export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessageLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true })
    try {
      const res = await axiosInstance.get('/messages/users')
      set({ users: res.data })
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isUsersLoading: false })
    }
  },

  getMessages: async (userId) => {
    set({ isMessageLoading: true })
    try {
      const res = await axiosInstance.get(`/messages/${userId}`)
      set({ messages: res?.data })
      // console.log((await res).data)
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isMessageLoading: false })
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get()

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      )
      console.log(res?.data)

      set({ messages: [...messages, res.data?.newMessage] })
    } catch (error) {
      toast.error(error.response.data.message)
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get()
    if (!selectedUser) return

    const socket = userAuthStore.getState().socket

    socket.on('newMessage', (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id
      if (!isMessageSentFromSelectedUser) return

      set({
        messages: [...get().messages, newMessage],
      })
    })
  },

  unsubscribeFromMessages: () => {
    const socket = userAuthStore.getState().socket
    socket.off('newMessage')
  },

  setSelectedUser: async (selectedUser) => {
    set({ selectedUser })
    try {
    } catch (error) {
      toast.error(error.response.data.message)
    }
  },
}))
