import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { db, isFirebaseConfigured } from '../firebase/config'
import { collection, query, where, onSnapshot, orderBy, addDoc, updateDoc, serverTimestamp, doc } from 'firebase/firestore'
import { useAuth } from '../firebase/AuthContext'
import { Send, ArrowLeft, MessageCircle, User } from 'lucide-react'

function Messages() {
  const { userProfile } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeChatId = searchParams.get('chatId')

  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loadingChats, setLoadingChats] = useState(true)
  
  const messagesEndRef = useRef(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Listen to user's chats
  useEffect(() => {
    if (!userProfile || !isFirebaseConfigured || !db) return

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', userProfile.uid),
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedChats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      // Sort locally since we can't easily order by timestamp when using array-contains without compound index
      fetchedChats.sort((a, b) => {
        const timeA = a.updatedAt?.toMillis() || 0
        const timeB = b.updatedAt?.toMillis() || 0
        return timeB - timeA
      })
      setChats(fetchedChats)
      setLoadingChats(false)
    }, (error) => {
      console.error("Error fetching chats:", error)
      setLoadingChats(false)
    })

    return () => unsubscribe()
  }, [userProfile])

  // Set active chat data
  useEffect(() => {
    if (activeChatId && chats.length > 0) {
      const found = chats.find(c => c.id === activeChatId)
      if (found) setActiveChat(found)
    } else {
      setActiveChat(null)
    }
  }, [activeChatId, chats])

  // Listen to active chat messages
  useEffect(() => {
    if (!activeChatId || !isFirebaseConfigured || !db) return

    const q = query(
      collection(db, 'chats', activeChatId, 'messages'),
      orderBy('createdAt', 'asc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setMessages(fetchedMessages)
    }, (error) => {
      console.error("Error fetching messages:", error)
    })

    return () => unsubscribe()
  }, [activeChatId])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeChatId || !userProfile) return

    const messageText = newMessage.trim()
    setNewMessage('') // clear immediately for UX

    try {
      // Add message to subcollection
      await addDoc(collection(db, 'chats', activeChatId, 'messages'), {
        senderId: userProfile.uid,
        text: messageText,
        createdAt: serverTimestamp()
      })

      // Update chat's last message
      await updateDoc(doc(db, 'chats', activeChatId), {
        lastMessage: messageText,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const getOtherParticipant = (chat) => {
    if (!chat || !chat.participantDetails || !userProfile) return null
    const otherUid = chat.participants.find(uid => uid !== userProfile.uid)
    return chat.participantDetails[otherUid] || { name: 'Unknown User' }
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  if (loadingChats) {
    return (
      <main className="messages-page" style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
      </main>
    )
  }

  return (
    <main className="messages-page" style={{ paddingTop: '80px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="container" style={{ flex: 1, display: 'flex', gap: '20px', paddingBottom: '20px', overflow: 'hidden' }}>
        
        {/* Inbox Sidebar (Hide on mobile if a chat is active) */}
        <div className={`inbox-sidebar glass-card ${activeChatId ? 'mobile-hidden' : ''}`} style={{ 
          width: '320px', 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%',
          overflowY: 'auto'
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-glass)' }}>
            <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageCircle size={20} /> Messages
            </h2>
          </div>
          
          <div className="chat-list" style={{ flex: 1, overflowY: 'auto' }}>
            {chats.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No conversations yet. <br /> Find a mentor and say hi!
              </div>
            ) : (
              chats.map(chat => {
                const otherUser = getOtherParticipant(chat)
                const isActive = activeChatId === chat.id
                return (
                  <div 
                    key={chat.id} 
                    onClick={() => setSearchParams({ chatId: chat.id })}
                    style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid var(--border-glass)',
                      cursor: 'pointer',
                      background: isActive ? 'rgba(108, 99, 255, 0.1)' : 'transparent',
                      transition: 'background 0.2s',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      background: 'var(--primary-dark)', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 'bold', flexShrink: 0
                    }}>
                      {otherUser?.avatar ? (
                        <img src={otherUser.avatar} alt="avatar" style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} />
                      ) : (
                        getInitials(otherUser?.name)
                      )}
                    </div>
                    <div style={{ overflow: 'hidden', flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {otherUser?.name}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {chat.lastMessage || 'New conversation'}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Active Chat Window */}
        <div className={`chat-window glass-card ${!activeChatId ? 'mobile-hidden' : ''}`} style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%',
          position: 'relative'
        }}>
          {!activeChatId ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
              <MessageCircle size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
              <h3>Select a conversation</h3>
              <p>Choose a chat from the left to start messaging</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div style={{ 
                padding: '16px 24px', 
                borderBottom: '1px solid var(--border-glass)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <button 
                  className="mobile-only btn btn-icon" 
                  onClick={() => setSearchParams({})}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: 0 }}
                >
                  <ArrowLeft size={20} />
                </button>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'var(--primary-dark)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                   {getOtherParticipant(activeChat)?.avatar ? (
                        <img src={getOtherParticipant(activeChat).avatar} alt="avatar" style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} />
                      ) : (
                        getInitials(getOtherParticipant(activeChat)?.name)
                      )}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{getOtherParticipant(activeChat)?.name}</h3>
                </div>
              </div>

              {/* Chat Messages */}
              <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: 'auto', marginBottom: 'auto' }}>
                    Say hello to start the conversation!
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMine = msg.senderId === userProfile.uid
                    return (
                      <div key={msg.id} style={{
                        alignSelf: isMine ? 'flex-end' : 'flex-start',
                        maxWidth: '70%',
                        background: isMine ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)',
                        color: isMine ? 'white' : 'var(--text-primary)',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        borderBottomRightRadius: isMine ? '4px' : '16px',
                        borderBottomLeftRadius: !isMine ? '4px' : '16px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}>
                        {msg.text}
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} style={{ 
                padding: '16px 24px', 
                borderTop: '1px solid var(--border-glass)',
                display: 'flex',
                gap: '12px',
                background: 'rgba(0,0,0,0.2)'
              }}>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="form-input"
                  style={{ flex: 1, marginBottom: 0, borderRadius: '24px' }}
                />
                <button type="submit" className="btn btn-primary" style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} disabled={!newMessage.trim()}>
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

export default Messages
