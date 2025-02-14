import React from 'react'
import { Popover } from '@headlessui/react'
import { useNotifications } from '../../hooks/useNotifications'



export default function NotificationBell() {
  const { notifications, markAsRead } = useNotifications()

  return (
    <Popover className="relative">
      <Popover.Button className="p-2 text-gray-600 hover:text-blue-600 relative">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </Popover.Button>

      <Popover.Panel className="absolute right-0 w-72 bg-white shadow-lg rounded-lg mt-2 z-50">
        <div className="p-4">
          <h3 className="font-semibold mb-2">Notifications</h3>
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm">No new notifications</p>
          ) : (
            <div className="space-y-2">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => markAsRead(notification.id)}
                >
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.timestamp?.toDate()).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Popover.Panel>
    </Popover>
  )
}