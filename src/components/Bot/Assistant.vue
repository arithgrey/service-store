<template>
  <div v-if="isEnabled" class="fixed bottom-4 right-4 z-50">
    <button 
      @click="toggleChat"
      class="w-14 h-14 rounded-full bg-emerald-400 text-white flex items-center justify-center shadow-lg hover:bg-emerald-500 transition-colors"
    >
      <span class="material-icons text-2xl">
        <MessageIcon /> 
      </span>
    </button>

    <div 
      v-if="isOpen" 
      class="absolute bottom-20 right-0 rounded-lg shadow-xl bg-white overflow-hidden chat-window"
      :class="{ 'w-[500px]': !isExpanded, 'w-[800px]': isExpanded }"
    >
      <div class="bg-emerald-400 p-4 flex items-center justify-between">
        <div class="flex items-center">
          <img src="@/assets/avatar.jpg" class="w-8 h-8 rounded-full" alt="Avatar">
          <span class="text-white ml-3 font-medium">Yo te ayudo!</span>
        </div>
        <div class="flex gap-2">
          <button @click="resetChat" class="text-white hover:text-emerald-100">
            <span class="material-icons">Reiniciar</span>
          </button>
          <button @click="toggleExpand" class="text-white hover:text-emerald-100">
            <svg v-if="isExpanded" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 9V4.5M9 9H4.5M15 9h4.5M15 9V4.5M15 15v4.5M15 15H4.5M15 15h4.5M9 15v4.5M9 15h4.5" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          </button>
          <button @click="closeChat" class="text-white hover:text-emerald-100">
            <CloseIcon />
          </button>
        </div>
      </div>

      <div 
        class="p-4 overflow-y-auto bg-gray-50"
        :class="{ 'h-80': !isExpanded, 'h-[600px]': isExpanded }"
      >
        <div v-for="(msg, index) in messages" :key="index" class="flex items-start mb-4">
          <template v-if="msg.sender === 'bot'">
            <img src="@/assets/avatar.jpg" class="w-8 h-8 rounded-full" alt="Avatar">
            <div class="ml-3 bg-gray-200 rounded-lg py-2 px-4">
              <div 
                class="prose prose-sm max-w-none prose-emerald" 
                v-html="formatMessage(msg.text)"
              ></div>
            </div>
          </template>
          <template v-else>
            <div class="ml-auto bg-emerald-400 rounded-lg py-2 px-4">
              <p class="text-white">{{ msg.text }}</p>
            </div>
          </template>
        </div>
        
        <!-- Indicador de escritura -->
        <div v-if="isTyping" class="flex items-start mb-4">
          <img src="@/assets/avatar.jpg" class="w-8 h-8 rounded-full" alt="Avatar">
          <div class="ml-3 bg-gray-200 rounded-lg py-2 px-4">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t p-4 bg-white">
        <div class="flex items-center">
          <input 
            type="text" 
            placeholder="Escribe un mensaje"
            class="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-400"
            v-model="message"
            @keyup.enter="sendMessage"
          >
          <button 
            @click="sendMessage"
            class="ml-2 text-emerald-400 hover:text-emerald-500"
          >
            <span class="material-icons">
                <SendMessageIcon />
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { marked } from 'marked'
import MessageIcon from '@/components/Icons/Message.vue'
import SendMessageIcon from '@/components/Icons/SendMessage.vue'
import CloseIcon from '@/components/Icons/CloseIcon.vue'
import { API_URLS } from '@/config/urls'

export default {
  name: 'Assistant',
  components: {
    MessageIcon,
    SendMessageIcon,
    CloseIcon
  },
  props: {
    isEnabled: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isOpen: false,
      isExpanded: false,
      message: '',
      messages: [],
      conversationId: null,
      storageKey: 'chat_history',
      isTyping: false
    }
  },
  created() {
    const savedChat = localStorage.getItem(this.storageKey)
    if (savedChat) {
      const chatData = JSON.parse(savedChat)
      this.messages = chatData.messages
      this.conversationId = chatData.conversationId
    } else {
      this.resetChat()
    }
  },
  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen
    },
    closeChat() {
      this.isOpen = false
    },
    minimize() {
      this.isOpen = false
    },
    async sendMessage() {
      if (this.message.trim()) {
        const userMessage = this.message
        
        this.messages.push({
          text: userMessage,
          sender: 'user',
          timestamp: new Date()
        })
        
        this.message = ''
        this.isTyping = true

        try {
          const requestBody = {
            message: userMessage
          }
          
          if (this.conversationId) {
            requestBody.conversation_id = this.conversationId
          }
          

          console.log(API_URLS.ASSISTANT.SEND_MESSAGE)
          const { data } = await this.$axios.post(API_URLS.ASSISTANT.SEND_MESSAGE, requestBody)
          this.isTyping = false

          if (data.conversation_id) {
            this.conversationId = data.conversation_id
          }

          if (data.ai_response && data.ai_response.content) {
            this.messages.push({
              text: data.ai_response.content,
              sender: 'bot',
              timestamp: new Date()
            })
          }

          this.saveToLocalStorage()

        } catch (error) {
          this.isTyping = false
          console.error('Error al enviar mensaje:', error)
          this.messages.push({
            text: 'Lo siento, hubo un error al procesar tu mensaje.',
            sender: 'bot',
            timestamp: new Date()
          })
          this.saveToLocalStorage()
        }

        this.$nextTick(() => {
          const container = document.querySelector('.overflow-y-auto')
          container.scrollTop = container.scrollHeight
        })
      }
    },
    resetChat() {
      this.messages = []
      this.conversationId = null
      this.messages.push({
        text: '¡Hola! ¿En qué puedo ayudarte hoy?',
        sender: 'bot',
        timestamp: new Date()
      })
      this.saveToLocalStorage()
    },
    saveToLocalStorage() {
      const chatData = {
        messages: this.messages,
        conversationId: this.conversationId
      }
      localStorage.setItem(this.storageKey, JSON.stringify(chatData))
    },
    toggleExpand() {
      this.isExpanded = !this.isExpanded
    },
    formatMessage(text) {
      return marked(text, {
        breaks: true,
        gfm: true
      })
    }
  }
}
</script>

<style>
.prose pre {
  background-color: #f3f4f6;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin: 0.5rem 0;
}

.prose code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.prose p {
  margin: 0.5rem 0;
}

.prose ul, .prose ol {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.prose li {
  margin: 0.25rem 0;
}
</style>