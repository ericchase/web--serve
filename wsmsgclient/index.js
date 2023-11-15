import { generateKeyIv, base64ToKeyIv, encrypt, decrypt } from './aes.js';
import { $button, $div, $input, $span, disable, enable, getClipboard, resizeSpanInput, setClipboard, swapSpanInput } from './lib.js';

const tls = true;
const serverHost = tls
  ? 'divine-snow-2261.fly.dev' // remote server
  : '127.0.0.1:8778'; // local

const bConnect = $button('connect');
const bDisconnect = $button('disconnect');
const bGenerateKeyIv = $button('generate-keyiv');
const bNewRoom = $button('new-room');
const bSend = $button('send');
const divOutput = $div('output');
const inMessage = $input('message');
const bCopyRoomId = $button('copy-room-id');
const inRoomIdInput = $input('input-room-id');
const sRoomId = $span('room-id');
const bCopyB64KeyIv = $button('copy-b64-keyiv');
const sB64KeyIv = $span('b64-keyiv');
const inB64KeyIvInput = $input('input-b64-keyiv');

for (const button of document.querySelectorAll('button')) {
  disable(button);
}
enable(bNewRoom);
enable(bGenerateKeyIv);

/** @type {WebSocket|null} */
let ws = null;
/** @type {CryptoKey|null} */
let key = null;
/** @type {Uint8Array|null} */
let iv = null;
let b64keyiv = '';

bNewRoom.addEventListener('click', async function () {
  const res = tls //
    ? await fetch('https://' + serverHost + '/create')
    : await fetch('http://' + serverHost + '/create');

  if (res.status === 200) {
    sRoomId.textContent = await res.text();
    enable(bConnect);
    enable(bCopyRoomId);
  }
});

bGenerateKeyIv.addEventListener('click', async function () {
  [key, iv, b64keyiv] = await generateKeyIv();
  sB64KeyIv.textContent = b64keyiv;
  enable(bCopyB64KeyIv);
});

bConnect.addEventListener('click', async function () {
  if (ws === null) {
    try {
      ws = tls //
        ? new WebSocket('wss://' + serverHost + '/' + sRoomId.textContent)
        : new WebSocket('ws://' + serverHost + '/' + sRoomId.textContent);

      ws.onopen = function () {
        disable(bConnect);
        enable(bDisconnect);
        enable(bSend);
      };
      ws.onclose = function () {
        ws = null;
        out('::DISCONNECTED::');
        enable(bConnect);
        disable(bDisconnect);
        disable(bSend);
      };
      ws.onmessage = async function (evt) {
        if (key && iv) {
          out(await decrypt(evt.data, key, iv));
        } else {
          out(evt.data);
        }
      };
      ws.onerror = function (evt) {
        out('::ERROR::');
        console.log('::ERROR::', evt);
      };
    } catch (err) {
      console.log('::SERVER-ERROR::', err);
    }
  }
});

bDisconnect.addEventListener('click', function () {
  if (ws !== null) {
    ws.close();
  }
});

bSend.addEventListener('click', function () {
  send();
});

inMessage.addEventListener('keydown', function (evt) {
  switch (evt.key) {
    case 'Enter':
      send();
      break;
    case 'ArrowUp':
      showMessageHistoryUp();
      break;
    case 'ArrowDown':
      showMessageHistoryDown();
      break;
  }
});

sRoomId.addEventListener('click', async function () {
  swapSpanInput(sRoomId, inRoomIdInput);
});
inRoomIdInput.addEventListener('focusout', function () {
  swapSpanInput(sRoomId, inRoomIdInput);
});
inRoomIdInput.addEventListener('input', function () {
  sRoomId.textContent = inRoomIdInput.value;
  resizeSpanInput(sRoomId, inRoomIdInput);
  if (ws) ws.close();
  disable(bDisconnect);
  if (sRoomId.textContent) {
    enable(bConnect);
    enable(bCopyRoomId);
  } else {
    disable(bConnect);
    disable(bCopyRoomId);
  }
});
bCopyRoomId.addEventListener('click', function () {
  if (sRoomId.textContent) {
    setClipboard(sRoomId.textContent);
  }
});

sB64KeyIv.addEventListener('click', async function () {
  swapSpanInput(sB64KeyIv, inB64KeyIvInput);
});
inB64KeyIvInput.addEventListener('focusout', function () {
  swapSpanInput(sB64KeyIv, inB64KeyIvInput);
});
inB64KeyIvInput.addEventListener('input', async function () {
  sB64KeyIv.textContent = inB64KeyIvInput.value;
  resizeSpanInput(sB64KeyIv, inB64KeyIvInput);
  if (sB64KeyIv.textContent) {
    [key, iv] = await base64ToKeyIv(sB64KeyIv.textContent);
    enable(bCopyB64KeyIv);
  } else {
    disable(bCopyB64KeyIv);
  }
});
bCopyB64KeyIv.addEventListener('click', function () {
  if (sB64KeyIv.textContent) {
    setClipboard(sB64KeyIv.textContent);
  }
});

// Helper Functions

const messageHistory = [];
let historyIndex = 0;
let unsetMessage = '';
async function send() {
  if (ws !== null) {
    messageHistory.push(inMessage.value);
    historyIndex = messageHistory.length;
    if (key && iv) {
      ws.send(await encrypt(inMessage.value, key, iv));
    } else {
      ws.send(inMessage.value);
    }
    inMessage.value = '';
    unsetMessage = '';
  }
}
function showMessageHistoryUp() {
  if (historyIndex === messageHistory.length) {
    unsetMessage = inMessage.value;
  }
  if (historyIndex > 0) {
    --historyIndex;
    inMessage.value = messageHistory[historyIndex];
  }
}
function showMessageHistoryDown() {
  if (historyIndex < messageHistory.length - 1) {
    ++historyIndex;
    inMessage.value = messageHistory[historyIndex];
  } else {
    historyIndex = messageHistory.length;
    inMessage.value = unsetMessage;
  }
}

/**
 * @param {*} message
 */
function out(...message) {
  const d = document.createElement('div');
  d.textContent = message;
  divOutput.appendChild(d);
  divOutput.scroll(0, divOutput.scrollHeight);
}
