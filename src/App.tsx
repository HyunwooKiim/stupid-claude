import { useState, useEffect, useRef } from 'react'
import './App.css'

interface Message {
  id: number
  text: string
  sender: 'user' | 'claude'
  timestamp: Date
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "안녕하세요! 저는 Claude입니다. 무엇을 도와드릴까요?",
      sender: 'claude',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isComposing, setIsComposing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateClaudeResponse = (userMessage: string): string => {
    const responses = [
      "잘 알아듣지 못하였어요 😵‍💫",
      "아이고... 이해를 못했네요 😵",
      "흠... 뭔 말인지 모르겠어요 😅",
      "당황스럽네요! 다시 한번 설명해주실까요? 😰",
      "어라? 무슨 뜻인지... 😳",
      "이해력이 부족한 것 같아요 😓",
      "아직 배우는 중이라... 😔",
      "??? 뭔소리여 😶",
      "헉... 어렵네요 😖",
      "이거... 뭐라고 해야할지 😐",
      "앗... 죄송해요 이해를 못했어요 😬",
      "으음... 복잡하네요 🤯",
      "저... 멍청해서 모르겠어요 🤤",
      "뇌정지 왔어요... 💀",
      "아직 공부가 부족한가봐요 📚😭",
      "음... 영어로 말해주시면... 아니 그래도 모를듯 🤡",
      "제가 AI가 맞나 싶어요... 🤖❓",
      "ChatGPT한테 물어보세요 😂",
      "구글 번역기보다 못한 것 같아요 🥲",
      "저 퇴사할게요... 👋😢",
      "뭔가... 알 것 같긴 한데... 모르겠어요 🫠",
      "한국어가 어려워요 ㅠㅠ 🇰🇷❓",
      "아... 네... 그렇군요... (못 알아들음) 😅",
      "천천히 말해주세요... 여전히 모를 것 같지만요 🐌",
      "이해했다고 거짓말하고 싶지만... 못했어요 😇",
      "뭔가 심오한 말씀이신 것 같은데... 🤔❓",
      "저희 회사에서 환불 가능한가요? 💸",
      "다른 AI 추천해드릴까요? 😂"
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }


  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return

    const currentInput = inputText
    const userMessage: Message = {
      id: Date.now(),
      text: currentInput,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    setTimeout(() => {
      const claudeMessage: Message = {
        id: Date.now() + Math.random(),
        text: generateClaudeResponse(currentInput),
        sender: 'claude',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, claudeMessage])
      setIsTyping(false)
    }, 1500 + Math.random() * 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault()
      if (!isTyping && inputText.trim()) {
        handleSendMessage()
      }
    }
  }

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = () => {
    setIsComposing(false)
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* 헤더 */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        padding: '1rem 2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem'
        }}>
          😵‍💫
        </div>
        <div>
          <h1 style={{ margin: 0, color: 'white', fontSize: '1.5rem' }}>멍청한 Claude</h1>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
            이해력 부족한 AI
          </p>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-start',
              gap: '0.5rem'
            }}
          >
            {message.sender === 'claude' && (
              <div style={{
                width: '30px',
                height: '30px',
                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                flexShrink: 0
              }}>
                😵‍💫
              </div>
            )}
            
            <div style={{
              maxWidth: '70%',
              background: message.sender === 'user' 
                ? 'linear-gradient(45deg, #4ecdc4, #45b7d1)' 
                : 'rgba(255, 255, 255, 0.9)',
              color: message.sender === 'user' ? 'white' : '#333',
              padding: '0.8rem 1.2rem',
              borderRadius: '1.5rem',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              animation: 'slideIn 0.3s ease-out'
            }}>
              {message.text}
              <div style={{
                fontSize: '0.7rem',
                opacity: 0.6,
                marginTop: '0.3rem'
              }}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {message.sender === 'user' && (
              <div style={{
                width: '30px',
                height: '30px',
                background: 'linear-gradient(45deg, #f0932b, #eb4d4b)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                flexShrink: 0
              }}>
                👤
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              width: '30px',
              height: '30px',
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem'
            }}>
              😵‍💫
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              padding: '0.8rem 1.2rem',
              borderRadius: '1.5rem',
              display: 'flex',
              gap: '0.3rem',
              alignItems: 'center'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                background: '#666',
                borderRadius: '50%',
                animation: 'typing 1.4s ease-in-out infinite'
              }} />
              <div style={{
                width: '8px',
                height: '8px',
                background: '#666',
                borderRadius: '50%',
                animation: 'typing 1.4s ease-in-out 0.2s infinite'
              }} />
              <div style={{
                width: '8px',
                height: '8px',
                background: '#666',
                borderRadius: '50%',
                animation: 'typing 1.4s ease-in-out 0.4s infinite'
              }} />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '1rem',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'flex-end'
      }}>
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder="뭔 말인지 모르겠지만 입력해보세요..."
          style={{
            flex: 1,
            background: 'white',
            color: '#333',
            border: 'none',
            borderRadius: '1.5rem',
            padding: '0.8rem 1.2rem',
            fontSize: '1rem',
            resize: 'none',
            minHeight: '20px',
            maxHeight: '120px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            outline: 'none'
          }}
          rows={1}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isTyping}
          style={{
            background: inputText.trim() && !isTyping 
              ? 'linear-gradient(45deg, #4ecdc4, #45b7d1)' 
              : '#ccc',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            cursor: inputText.trim() && !isTyping ? 'pointer' : 'not-allowed',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease'
          }}
        >
          📤
        </button>
      </div>

      <style>{`
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  )
}

export default App
