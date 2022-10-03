import { PrismaClient } from '@prisma/client'
// export const prisma = new PrismaClient()

let prisma;

//check if we are running in production mode
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
//check if there is already a connection to the database
  if (!global.db) {
    global.db = new PrismaClient()
  }
  prisma = global.db
}

export { prisma };