import { doubleCsrf } from 'csrf-csrf'
import { CSRF_SECRET } from '../config'

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
    getSecret: () => CSRF_SECRET,
    getSessionIdentifier: () => 'anon',
    cookieName: '_csrf',
    cookieOptions: {
        sameSite: 'lax',
        secure: false,
        path: '/',
    },
})

export { generateCsrfToken, doubleCsrfProtection }
