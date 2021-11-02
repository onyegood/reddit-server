const __PROD__ = process.env.NODE_ENV !== 'production';
const COOKIE_NAME = 'qid';
const FORGOT_PASSWORD_PREFIX = 'forgot-password:'

export {
    __PROD__,
    COOKIE_NAME,
    FORGOT_PASSWORD_PREFIX
}