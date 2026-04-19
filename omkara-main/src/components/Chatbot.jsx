import { useState, useRef, useEffect } from 'react'

const chatFlow = [
  { bot: ['Great! What type of property are you looking for?'], options: ['2 BHK Apartment', '3 BHK Apartment', '4 BHK / Villa', 'Commercial Space', 'Penthouse'] },
  { bot: ['Excellent choice! Which city do you prefer?'], options: ['Mumbai', 'Bengaluru', 'Hyderabad', 'Gurugram', 'Pune', 'Open to Suggestions'] },
  { bot: ['Perfect! Based on your preferences, I recommend:', '🏆 <strong>Shivalaya</strong> — Bandra West, Mumbai from ₹4.5 Cr', '🏙️ <strong>Omkara Greens</strong> — Whitefield, Bengaluru from ₹1.8 Cr', 'Would you like to book a site visit or get more details?'], options: ['Book Site Visit', 'Download Brochure', 'Talk to an Expert', 'View More Projects'] },
  { bot: ['Wonderful! Let me get your contact details so our expert can reach you promptly.'], options: ['Share my number via WhatsApp'] },
]

export default function Chatbot({ onOpenBooking }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { type: 'bot', text: "👋 Hello! I'm Priya. How can I help you find your perfect Omkara property today?" },
    { type: 'bot', text: "What's your budget range?" },
  ])
  const [options, setOptions] = useState(['₹1–2 Crore', '₹2–5 Crore', '₹5 Crore+'])
  const [input, setInput] = useState('')
  const [chatState, setChatState] = useState(0)
  const messagesRef = useRef(null)

  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight
  }, [messages])

  const addBot = (text) => setMessages(prev => [...prev, { type: 'bot', text }])
  const addUser = (text) => setMessages(prev => [...prev, { type: 'user', text }])

  const handleOption = (opt) => {
    addUser(opt)
    setOptions([])
    if (opt === 'Book Site Visit') {
      setTimeout(() => { addBot("Great! I'll open the booking form for you. 📅"); setTimeout(() => { setOpen(false); onOpenBooking() }, 800) }, 400)
      return
    }
    if (opt === 'Talk to an Expert') { setTimeout(() => addBot('Connecting you with our expert now! 📞 You can also reach us at <strong>+91 800 123 4567</strong> or via WhatsApp.'), 400); return }
    if (opt === 'Download Brochure') { setTimeout(() => addBot('Please share your email to receive the brochure instantly! 📧'), 400); return }
    if (opt === 'Share my number via WhatsApp') { setTimeout(() => addBot('Click the WhatsApp button below to connect directly! 💬'), 400); return }

    const next = chatState + 1
    setChatState(next)
    if (next < chatFlow.length) {
      const flow = chatFlow[next]
      flow.bot.forEach((msg, i) => setTimeout(() => addBot(msg), 400 + i * 500))
      setTimeout(() => setOptions(flow.options), 400 + flow.bot.length * 500)
    } else {
      setTimeout(() => addBot('Thank you! Our expert will contact you within 2 hours. Meanwhile, feel free to explore our projects. 🏠'), 400)
    }
  }

  const sendMessage = () => {
    if (!input.trim()) return
    addUser(input.trim())
    setInput('')
    const responses = [
      "That's a great question! Let me help you find the perfect property. 🏠",
      "I'd be happy to assist you with that. Could you tell me more about your requirements?",
      "Excellent! Our team specializes in exactly this. Would you like to speak with an expert?",
      "Based on your interest, I recommend checking out Shivalaya. Shall I arrange a site visit?",
    ]
    setTimeout(() => addBot(responses[Math.floor(Math.random() * responses.length)]), 600)
  }

  return (
    <>
      <button className="chatbot-toggle" onClick={() => setOpen(o => !o)}><i className="fas fa-robot"></i></button>
      <div className={`chatbot-window${open ? ' open' : ''}`} id="chatbotWindow">
        <div className="chatbot-header">
          <div className="chatbot-avatar"><i className="fas fa-robot"></i></div>
          <div className="chatbot-header-info"><h5>Priya — AI Advisor</h5><p>🟢 Online</p></div>
          <button className="chatbot-close" onClick={() => setOpen(false)}><i className="fas fa-times"></i></button>
        </div>
        <div className="chatbot-messages" ref={messagesRef}>
          {messages.map((m, i) => (
            <div key={i} className={`chat-message ${m.type}`} dangerouslySetInnerHTML={{ __html: m.text }} />
          ))}
        </div>
        {options.length > 0 && (
          <div className="chat-options">
            {options.map(o => <button key={o} className="chat-option-btn" onClick={() => handleOption(o)}>{o}</button>)}
          </div>
        )}
        <div className="chatbot-input-area">
          <input type="text" className="chatbot-input" placeholder="Type a message..." value={input}
            onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMessage()} />
          <button className="chatbot-send" onClick={sendMessage}><i className="fas fa-paper-plane"></i></button>
        </div>
      </div>
    </>
  )
}
