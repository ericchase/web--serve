import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBVG-kb6ZIxOXBJVaKYMOssULqhZnaqbhQ',
  authDomain: 'pomotimerauth.firebaseapp.com',
  projectId: 'pomotimerauth',
  storageBucket: 'pomotimerauth.appspot.com',
  messagingSenderId: '423381096859',
  appId: '1:423381096859:web:9c77d01a26b5313840693e',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();

document.addEventListener('DOMContentLoaded', function () {
  const signInGoogleButton = document.getElementById('sign-in-google-btn');

  if (signInGoogleButton) {
    signInGoogleButton.addEventListener('click', () => {
      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const user = result.user;
          const userName = user.displayName;
          const userAvatar = user.photoURL;
          localStorage.setItem('userName', userName);
          localStorage.setItem('userAvatar', userAvatar);
          window.location.href = './main.html';
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log('Error', errorCode, errorMessage);
        });
    });
  }
});
