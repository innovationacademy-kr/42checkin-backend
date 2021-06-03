import path from 'path'
import dotenv from 'dotenv'

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: path.join(__dirname, '../../.env.production') })
} else if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: path.join(__dirname, '../../.env.development') })
} else {
  throw new Error('process.env.NODE_ENV를 설정하지 않았습니다!')
}

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  env: process.env.NODE_ENV,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
  client: {
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET,
    callback: process.env.CLIENT_CALLBACK,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  log: {
    debug: process.env.LOG_DEBUG == 'true' ? true : false,
  },
  discord: {
    gaepo: {
      id: process.env.DISCORD_GAEPO_ID,
      pw: process.env.DISCORD_GAEPO_PW,
    },
    seocho: {
      id: process.env.DISCORD_SEOCHO_ID,
      pw: process.env.DISCORD_SEOCHO_PW,
    },
  },
  mailer: {
    mail: process.env.MAIL,
  },
};
console.log({config})
export default config;

