'use strict';

import { auth } from './index.js';

import { getApps, initializeApp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js';

import { collection, doc, getDoc, getDocs, getFirestore, setDoc } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBVG-kb6ZIxOXBJVaKYMOssULqhZnaqbhQ',
  authDomain: 'pomotimerauth.firebaseapp.com',
  projectId: 'pomotimerauth',
  storageBucket: 'pomotimerauth.appspot.com',
  messagingSenderId: '423381096859',
  appId: '1:423381096859:web:9c77d01a26b5313840693e',
};

let db;
if (!getApps().length) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} else {
  db = getFirestore();
}

tsParticles.load('particles-container', {
  particles: {
    number: {
      value: 50,
    },
    size: {
      value: 1,
    },
    move: {
      enable: true,
    },
  },
});

const textTimer = document.getElementById('text-timer');
const textSessionCount = document.getElementById('text-session-count');
const btnStart = document.getElementById('btn-start');
const btnReset = document.getElementById('btn-reset');
const textSessionStatus = document.getElementById('text-status');
const btnSettings = document.getElementById('btn-settings');
const settingsModal = document.getElementById('modal-settings');
const btnSubmitForm = document.getElementById('btn-submit-form');
const inputSessionLength = document.getElementById('input-session-length');
const inputMaxSessionCount = document.getElementById('input-max-session-count');
const inputShortbreakLength = document.getElementById('input-short-break-length');
const inputlongBreakLength = document.getElementById('input-long-break-length');

let maxSessionCount;
let sessionLength;
let shortBreakLength;
let longBreakLength;

let time;
let totalTime = 0;

let sessionStatus = 'Not started';
let currentInterval;
let typeOfSession = '';
let currentSessionCount = 0;

const sound = new Howl({
  src: ['sound.wav'],
});

btnStart.addEventListener('click', startTimer);
btnReset.addEventListener('click', completeReset);
btnSettings.addEventListener('click', openSettings);
btnSubmitForm.addEventListener('click', submitForm);

function openSettings() {
  settingsModal.showModal();
}

function submitForm() {
  sessionLength = inputSessionLength.value;
  maxSessionCount = inputMaxSessionCount.value;
  shortBreakLength = inputShortbreakLength.value;
  longBreakLength = inputlongBreakLength.value;
  completeReset();
  saveTimerPreferences(uid, {
    sessionLength: sessionLength,
    maxSessionCount: maxSessionCount,
    shortBreakLength: shortBreakLength,
    longBreakLength: longBreakLength,
    totalTime: totalTime,
    userName: userName,
  });
}

function startTimer() {
  if (sessionStatus == 'Not started' || sessionStatus == 'Session not started') {
    startSession();
  } else if (sessionStatus == 'Break not started') startBreak();
  else if (sessionStatus != 'Paused') {
    pauseTimer();
  } else if (sessionStatus == 'Paused') {
    resumeTimer();
  }
}

function startSession() {
  btnStart.textContent = 'Pause';
  sessionStatus = 'Session';
  time = sessionLength * 60;
  updateUI();
  currentInterval = setInterval(() => {
    time--;
    if (time <= 0) {
      totalTime += parseInt(sessionLength);
      saveTimerPreferences(uid, {
        sessionLength: sessionLength,
        maxSessionCount: maxSessionCount,
        shortBreakLength: shortBreakLength,
        longBreakLength: longBreakLength,
        totalTime: totalTime,
        userName: userName,
      });
      sound.play();
      clearInterval(currentInterval);
      sessionStatus = 'Break not started';
      currentSessionCount++;
      btnStart.textContent = 'Start';
    }

    updateUI();
  }, 1000);
}

function startBreak() {
  btnStart.textContent = 'Pause';
  if (currentSessionCount > maxSessionCount) {
    completeReset();
    return;
  }
  if (currentSessionCount < maxSessionCount) {
    sessionStatus = 'Short break';
    time = shortBreakLength * 60;
  } else {
    sessionStatus = 'Long break';
    time = longBreakLength * 60;
  }
  currentInterval = setInterval(() => {
    time--;
    if (time <= 0 && sessionStatus == 'Long break') {
      btnStart.textContent = 'Start';
      sound.play();

      completeReset();
    } else if (time <= 0) {
      sound.play();
      btnStart.textContent = 'Start';
      clearInterval(currentInterval);
      sessionStatus = 'Session not started';
    }
    updateUI();
  }, 1000);
  updateUI();
}

function completeReset() {
  btnStart.textContent = 'Start';
  currentSessionCount = 0;
  clearInterval(currentInterval);
  time = sessionLength * 60;
  sessionStatus = 'Not started';
  updateUI();
}

function updateUI() {
  const minutes = String(Math.trunc(time / 60)).padStart(2, '0');
  const seconds = String(time % 60).padStart(2, '0');
  textTimer.textContent = `${minutes}:${seconds}`;
  textSessionCount.textContent = `${currentSessionCount}/${maxSessionCount}`;
  textSessionStatus.textContent = sessionStatus;
}

function pauseTimer() {
  typeOfSession = sessionStatus;
  sessionStatus = 'Paused';
  btnStart.textContent = 'Resume';
  clearInterval(currentInterval);
  updateUI();
}

function resumeTimer() {
  btnStart.textContent = 'Pause';
  sessionStatus = typeOfSession;

  currentInterval = setInterval(() => {
    time--;
    if (time <= 0) {
      sound.play();
      clearInterval(currentInterval);
      if (sessionStatus === 'Session') {
        sessionStatus = 'Break not started';
        currentSessionCount++;
        btnStart.textContent = 'Start';
      } else if (sessionStatus === 'Short break') {
        btnStart.textContent = 'Start';
        sessionStatus = 'Session not started';
      } else {
        btnStart.textContent = 'Start';
        completeReset();
      }
    }

    updateUI();
  }, 1000);
}
let userName;
let userAvatar;
window.addEventListener('DOMContentLoaded', function () {
  userName = localStorage.getItem('userName');
  userAvatar = localStorage.getItem('userAvatar');

  userAvatar = userAvatar.substring(0, userAvatar.length - 6) + '=c';

  document.getElementById('user-name').textContent = userName;
  document.getElementById('pfp-img').src = userAvatar;

  const signOutButton = document.getElementById('sign-out-btn');
  signOutButton.addEventListener('click', () => {
    auth
      .signOut()
      .then(() => {
        localStorage.removeItem('userName');
        localStorage.removeItem('userAvatar');
        window.location.href = 'index.html';
      })
      .catch((error) => {
        console.error('Sign Out Error', error);
      });
  });
  updateUI();
});

async function saveTimerPreferences(userId, preferences) {
  await setDoc(doc(db, 'users', userId), preferences);
}

let uid;
auth.onAuthStateChanged(async (user) => {
  if (user) {
    uid = user.uid;
    userName = user.displayName;
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      sessionLength = data.sessionLength;
      maxSessionCount = data.maxSessionCount;
      shortBreakLength = data.shortBreakLength;
      longBreakLength = data.longBreakLength;
      totalTime = data.totalTime;
      inputSessionLength.setAttribute('value', sessionLength);
      inputMaxSessionCount.setAttribute('value', maxSessionCount);
      inputShortbreakLength.setAttribute('value', shortBreakLength);
      inputlongBreakLength.setAttribute('value', longBreakLength);
      time = sessionLength * 60;
      saveTimerPreferences(uid, {
        sessionLength: sessionLength,
        maxSessionCount: maxSessionCount,
        shortBreakLength: shortBreakLength,
        longBreakLength: longBreakLength,
        totalTime: totalTime,
        userName: user.displayName,
      });
      updateUI();
    } else {
      maxSessionCount = 4;
      sessionLength = 25;
      shortBreakLength = 5;
      longBreakLength = 15;
      time = sessionLength * 60;
      totalTime = 0;
      saveTimerPreferences(uid, {
        sessionLength: sessionLength,
        maxSessionCount: maxSessionCount,
        shortBreakLength: shortBreakLength,
        longBreakLength: longBreakLength,
        totalTime: totalTime,
        userName: user.displayName,
      });
      updateUI();
    }
  } else {
  }
});

async function getTotalTimes() {
  const usersRef = await collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  const totalTimes = {};
  for (let doc of snapshot.docs) {
    const data = doc.data();
    totalTimes[data.userName] = data.totalTime;
  }
  return totalTimes;
}

function updateLeaderboard() {
  getTotalTimes().then((totalTimes) => {
    const sortable = Object.entries(totalTimes).sort((a, b) => b[1] - a[1]);
    let leaderboard = document.getElementById('highest-time-label');
    leaderboard.innerHTML = '';
    for (let index = 0; index < sortable.length; index++) {
      if (index >= 10) break;
      let user = sortable[index];
      let li = document.createElement('li');
      li.textContent = `${index + 1}. ${user[0]}: ${user[1]} minutes`;
      leaderboard.appendChild(li);
    }
  });
}
updateLeaderboard();

const leaderboardUpdateTimer = setInterval(() => {
  updateLeaderboard();
}, 1000 * 60 * 15);
