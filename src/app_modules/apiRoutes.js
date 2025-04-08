const API_URL = 'https://srv594954.hstgr.cloud'; //https://srv594954.hstgr.cloud

export const API_ROUTES = {
  login: `${API_URL}/login/doxsify`,
  signup: `${API_URL}/signup/doxsify`,
  displayImg: `${API_URL}`,
  sessionCheck: `${API_URL}/api/session-check/doxsify`,
  userData: `${API_URL}/api/user`,
  aiImgChat: `${API_URL}/api/process-images/doxsify`,
  aiChat: `${API_URL}/api/chat/ai/doxsify`,
  saveUserData: `${API_URL}/api/save-details/doxsify`,
  saveUserMedData: `${API_URL}/api/save-medical-details/doxsify`,
  getPremium: `${API_URL}/buy-premium/doxsify`,
  verifyPayment: `${API_URL}/verify-payment/doxsify`,
  checkSubscription: `${API_URL}/check-subscription/doxsify`,
  checkProfileCompletion: `${API_URL}/check-profile-completion`,
  getUserProfile: `${API_URL}/getUserProfile/doxsify`,
  sessionCheck: `${API_URL}/api/verify-token`,
  doxsifyResetPassword: `${API_URL}/api/doxsify/reset-password`,
  doxsifyForgotPassword: `${API_URL}/api/doxsify/forgot-password`,
  apiLogDownload: `${API_URL}/api/log-download/doxsify`
}
