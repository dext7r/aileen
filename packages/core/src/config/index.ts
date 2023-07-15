require('dotenv').config()
export const evConfig = {
  log: {
    isLog: process.env.isLog ?? false,
  },
  store: {
    storeDirs: process.env.storeDirs ?? '',
  },
}
