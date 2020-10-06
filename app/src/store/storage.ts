import SecureLS from 'secure-ls'

export const storageKey = 'vuexChat'

export const secureStorage = new SecureLS({ isCompression: false })

// vuexChatをキーにしてstorageに保存する
const initialStoreContent = secureStorage.get(storageKey)
export const initialStorage = initialStoreContent
  ? JSON.parse(initialStoreContent)
  : {}
