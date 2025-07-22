import { useState, useEffect, useRef } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import ReactMarkdown from 'react-markdown'
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
  
  // Gemini AI 설정
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '')
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateGeminiResponse = async (userMessage: string): Promise<string> => {
    try {
      // 대화 히스토리를 컨텍스트에 포함
      let conversationContext = "너는 Claude ai야 마크다운을 많이 활용해서 대화를 해줘!\n\n"

      // 최근 10개 메시지만 컨텍스트에 포함 (메모리 절약)
      const recentMessages = messages.slice(-10)
      recentMessages.forEach(msg => {
        if (msg.sender === 'user') {
          conversationContext += `사용자: ${msg.text}\n`
        } else {
          conversationContext += `Claude: ${msg.text}\n`
        }
      })
      
      conversationContext += `\n사용자: ${userMessage}\nClaude:`
      
      const result = await model.generateContent(conversationContext)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Gemini API Error:', error)
      // API 실패시 백업 응답
      const backupResponses = [
        "죄송해요, 지금 생각이 잘 안나네요... 🤔",
        "음... 잠시 머리가 멈췄어요 😅",
        "아직 준비중이에요! 🚧",
        "서버가 좀 느려서... 🐌"
      ]
      return backupResponses[Math.floor(Math.random() * backupResponses.length)]
    }
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

    try {
      const geminiResponse = await generateGeminiResponse(currentInput)
      const claudeMessage: Message = {
        id: Date.now() + Math.random(),
        text: geminiResponse,
        sender: 'claude',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, claudeMessage])
    } catch (error) {
      console.error('Error generating response:', error)
      const errorMessage: Message = {
        id: Date.now() + Math.random(),
        text: "죄송해요, 뭔가 문제가 생겼어요... 😅",
        sender: 'claude',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
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
          background: 'linear-gradient(45deg, #4285f4, #34a853)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem'
        }}>
          🤖
        </div>
        <div>
          <h1 style={{ margin: 0, color: 'white', fontSize: '1.5rem' }}>Claude AI</h1>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
            Anthropic의 AI 어시스턴트
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
                background: 'linear-gradient(45deg, #4285f4, #34a853)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                flexShrink: 0
              }}>
                🤖
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
              <div className="markdown-content">
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
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
              background: 'linear-gradient(45deg, #4285f4, #34a853)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem'
            }}>
              🤖
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
          placeholder="Claude에게 무엇이든 물어보세요!"
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
