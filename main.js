const root = document.getElementById('root');
const container = document.createElement('div');
container.id = 'container';
root.appendChild(container);
const header = document.createElement('div');
header.id = 'header';
container.appendChild(header);
const titleContainer = document.createElement('div');
titleContainer.id = 'titleContainer';
header.appendChild(titleContainer);
const title = document.createElement('h1');
title.innerText = 'Roman Numerals';
titleContainer.appendChild(title);
const columnImage = document.createElement('img');
columnImage.classList.add('column');
columnImage.src = './img/image.png';
header.insertBefore(columnImage,titleContainer);
const tagline = document.createElement('p');
tagline.id = 'tagline';
tagline.innerText = 'The Roman Numerals Converter';
titleContainer.appendChild(tagline);
const formContainer = document.createElement('div');
formContainer.id = 'formContainer';
container.appendChild(formContainer);
const form = document.createElement('form');
formContainer.appendChild(form);
const input = document.createElement('input');
input.setAttribute('type', 'text');
input.setAttribute('placeholder', 'Enter number here');
input.setAttribute('autocomplete', 'off');
input.id = 'textInput';
form.appendChild(input);
const submit = document.createElement('input');
submit.setAttribute('type','submit');
submit.id = 'submit';
form.appendChild(submit);
const messageContainer = document.createElement('p');
messageContainer.id = '';
formContainer.appendChild(messageContainer);


// ----------LOGIC---------- //

// dictionary object of objects to pass through function depending on decimal level of number.
const decimalValues = {
  units: {
    ten: 'X',
    five: 'V',
    unit: 'I'
  },
  tens: {
    ten: 'C',
    five: 'L',
    unit: 'X'
  },
  hundreds: {
    ten: 'M',
    five: 'D',
    unit: 'C'
  },
  thousands: {
    unit: 'M'
  }
};

// function to convert one number to Roman numerals depending on level i.e. ones, tens, hundreds.
function convertDigit(digit, {ten, five, unit}){
  if (digit%5 === 4){
    return digit > 5 ? unit+ten : unit+five;
  }
  return digit >= 5 ? five+unit.repeat(digit-5) : unit.repeat(digit);
}

// function which splits a number (represented as a string), reverses it (in order to establish that 0 index is always units) and works backwards through it to create the full Roman numeral.
function makeRomanNumerals(str){
  const reverseNumberArray = str.split('').reverse();
  let romanNumeral = '';
  for (let i = reverseNumberArray.length-1; i >= 0; i--) {
    const number = reverseNumberArray[i];
    if (isNaN(parseInt(number))){
      return;
    }
    if ((i == 3 && number > 3) || i > 3){
      return true;
    }
    i == 3 && (romanNumeral += convertDigit(number,decimalValues.thousands));
    i == 2 && (romanNumeral += convertDigit(number,decimalValues.hundreds));
    i == 1 && (romanNumeral += convertDigit(number,decimalValues.tens));
    i == 0 && (romanNumeral += convertDigit(number,decimalValues.units));
  }
  return romanNumeral;
}

// dictionary to refer to in the function to convert Roman numerals to numbers.
const romanNumeralsDictionary = {
  M: 1000,
  D: 500,
  C: 100,
  L: 50,
  X: 10,
  V: 5,
  I: 1
};

// function to convert Roman numeral strings into numbers.
function makeNumberFromRomanNumeral(str){
  let numberTotal = 0; // the total which is added to and eventually returned.
  let infoSoFar; // to run checks in case the next number is greater.
  for (const letter of str.split('')){
    if (!romanNumeralsDictionary[letter]){
      return;
    }
    const currentNumber = romanNumeralsDictionary[letter];
    if (infoSoFar == undefined){
      infoSoFar = currentNumber;
      // numberTotal += currentNumber; // this number is pushed to total but later edited in the case that the next number is greater.
    }
    else if (infoSoFar >= currentNumber){
      numberTotal += infoSoFar;
      infoSoFar = currentNumber;
      // numberTotal += currentNumber-infoSoFar*2; // infoSoFar is subtracted from total twice: once to represent numeral logic and again as it was previously pushed.
      // infoSoFar = undefined; // infoSoFar is cleared.
    }
    else{
      numberTotal += currentNumber - infoSoFar;
      infoSoFar = undefined;
    }
  }
  infoSoFar && (numberTotal += infoSoFar);
  return numberTotal;
}

// function which recognises both Roman numerals and numbers and converts them accordingly.
function convertRomanNumeralsAndNumbers(str){
  return isNaN(parseInt(str)) ? makeNumberFromRomanNumeral(str) : makeRomanNumerals(str);
}
function outputMessage(str){
  const result = convertRomanNumeralsAndNumbers(str);
  if (!result){
    messageContainer.id = 'error';
    return 'Please enter a valid number or Roman numeral.';
  }
  else if (typeof result === 'string'){
    messageContainer.id = 'message';
    return `${str} in Roman numerals is ${result}.`;
  }
  else if (result === true){
    messageContainer.id = 'high';
    return 'This number is too high to be expressed in Roman numerals.';
  }
  else{
    messageContainer.id = 'message';
    return `${str} is ${result}.`;
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = outputMessage(e.target[0].value);
  messageContainer.classList.add('messageContainer');
  messageContainer.innerText = message;
  if (!messageContainer.classList.contains('animated')){
    messageContainer.classList.add('animated');
    setTimeout(function() {
      messageContainer.classList.remove('animated');
    }, 1000);
  }
});

