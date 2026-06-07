const AUTH_KEY = 'ciferon_logged_in';
const OUTLETS_URL = 'outlets.html';

function setLoggedIn() {
  sessionStorage.setItem(AUTH_KEY, 'true');
}

function redirectToOutlets() {
  setLoggedIn();
  window.location.href = OUTLETS_URL;
}

document.addEventListener('DOMContentLoaded', () => {
  if (isLoggedInOnLoginPage()) {
    window.location.href = OUTLETS_URL;
    return;
  }

  const loginForm = document.getElementById('login-form');
  const otpForm = document.getElementById('otp-form');
  const sendOtpBtn = document.getElementById('send-otp-btn');

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const email = loginForm.email.value.trim();
      const password = loginForm.password.value;

      if (!email || !password) {
        alert('Please enter both email and password.');
        return;
      }

      if (!email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
      }

      redirectToOutlets();
    });
  }

  if (otpForm) {
    let otpSent = false;

    otpForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const email = otpForm.email.value.trim();
      const otp = otpForm.otp?.value.trim();

      if (!email) {
        alert('Please enter your email address.');
        return;
      }

      if (!email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
      }

      if (!otpSent) {
        otpSent = true;
        if (sendOtpBtn) {
          sendOtpBtn.textContent = 'Verify OTP';
        }
        const otpField = document.getElementById('otp-field');
        if (otpField) {
          otpField.hidden = false;
          otpField.querySelector('input')?.focus();
        }
        return;
      }

      if (!otp) {
        alert('Please enter the OTP sent to your email.');
        return;
      }

      redirectToOutlets();
    });
  }
});

function isLoggedInOnLoginPage() {
  return sessionStorage.getItem(AUTH_KEY) === 'true';
}
