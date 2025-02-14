import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from './useAuth'

export function useNotifications() {
  const { currentUser } = useAuth()
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (!currentUser) return

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', currentUser.uid),
      where('read', '==', false)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setNotifications(notifications)
    })

    return unsubscribe
  }, [currentUser])

  const markAsRead = async (notificationId) => {
    await updateDoc(doc(db, 'notifications', notificationId), { read: true })
  }

  return { notifications, markAsRead }
}