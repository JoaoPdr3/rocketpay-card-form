import "./css/index.css"
import IMask from "imask";

/**
 * Mask Cor
 * // const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
 * // const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
 */

const ccBg = document.querySelector(".cc");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");

function setCardType(type) {
  // const colors = {
  //   "visa": ["#436D99", "#2D57F2"],
  //   "mastercard": ["#DF6F29", "#C69347"],
  //   "default": ["black", "grey"]
  // }

  // ccBgColor01.setAttribute("fill", colors[type][0]);
  // ccBgColor02.setAttribute("fill", colors[type][1]);

  ccBg.style.backgroundImage = `url(cc-bg-${type}.svg)`;
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType;

// cc security code
const securityCode = document.querySelector('#security-code');
const securityCodePattern = {
  mask: "0000"
}
const securityCodeMasked = IMask(securityCode, securityCodePattern);

// cc expiration-date
const expirationDate = document.querySelector('#expiration-date');
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },

    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    }
  }
}
const expirationDateCodeMasked = IMask(expirationDate, expirationDatePattern);

// cc number
const cardNumber = document.querySelector("#card-number");
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /(^4011(78|79)|^43(1274|8935)|^45(1416|7393|763(1|2))|^50(4175|6699|67[0-6][0-9]|677[0-8]|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9])|^62(7780)|^63(6297|6368|6369))\d{0,10}/,
      cardtype: "elo"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^3[47]\d{0,13}/,
      cardtype: "express"
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default"
    }
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "");
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex);
    });
    return foundMask;
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

const addButton = document.querySelector("#add-card");
addButton.addEventListener("click", () => {
  alert("Cartão adicionado com sucesso.");
});

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
});

const cardHolder = document.querySelector("#card-holder");
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value");

  ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value;
});

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value);
});

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value");

  ccSecurity.innerText = code.length === 0 ? "123" : code;
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype;
  setCardType(cardType);
  updateCardNumber(cardNumberMasked.value);
});

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number");

  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number;
}

expirationDateCodeMasked.on("accept", () => {
  upadteExpirationDate(expirationDateCodeMasked.value);
});

function upadteExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-expiration .value");

  ccExpiration.innerText = date.length === 0 ? "02/32" : date;
}