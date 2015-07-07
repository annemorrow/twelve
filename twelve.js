function operatorIndex(str) {
  for (var i = 1; i < str.length; i++) {
    if(isNaN(str[i])) return i;
  }
}

function singleOperation(str) {
  var opIndex = operatorIndex(str);
  var firstNumber = Number(str.substring(0, opIndex));
  var secondNumber = Number(str.substring(opIndex + 1, str.length));
  if (str[opIndex] == "+") {
    return firstNumber + secondNumber;
  }
  if (str[opIndex] == "-") {
    return firstNumber - secondNumber;
  }
  if (str[opIndex] == "*") {
    return firstNumber * secondNumber;
  }
  if (str[opIndex] == "/") {
    return firstNumber / secondNumber;
  }
}


function simplifyAroundOperator(str, indexOfOperator) {
  var startOfExpression = indexOfOperator;
  while (startOfExpression > 0 && !isNaN(str[startOfExpression - 1])) {
    startOfExpression--;
  }
  if (startOfExpression == 1 && str[0] == "-") {
    startOfExpression--;
  }
  var endOfExpression = indexOfOperator;
  while (endOfExpression < str.length && !isNaN(str[endOfExpression + 1])) {
    endOfExpression++;
  }
  var prefix = str.substring(0, startOfExpression);
  var suffix = str.substring(endOfExpression + 1, str.length);
  var simplified = singleOperation(str.substring(startOfExpression, endOfExpression + 1));
  return prefix + simplified.toString() + suffix;
}

function simplifyWhenNoParentheses(str) {
  var multIndex = str.indexOf("*");
  var divIndex = str.indexOf("/");
  var plusIndex = str.indexOf("+");
  var minusIndex = str.substring(1, str.length).indexOf("-");
  if (minusIndex >= 0) minusIndex++;
  
  var firstOperatorIndex = multIndex;
  if (firstOperatorIndex < 0 || (divIndex < firstOperatorIndex && divIndex > 0)) {
    firstOperatorIndex = divIndex;
  }
  if (firstOperatorIndex < 0) {
    firstOperatorIndex = plusIndex;
    if (firstOperatorIndex < 0 || (minusIndex < firstOperatorIndex && minusIndex > 0)) {
      firstOperatorIndex = minusIndex;
    }
  }
  if (firstOperatorIndex < 0) {
    return str;
  } else {
    return simplifyWhenNoParentheses(simplifyAroundOperator(str, firstOperatorIndex));
  }
}

function simplifyWithParentheses(str) {
  console.log(str);
  var indexOfClose = str.indexOf(")");
  if (indexOfClose < 0) {
    return simplifyWhenNoParentheses(str);
  }
  var indexOfOpen = indexOfClose;
  while (str[indexOfOpen] != "(") {
    indexOfOpen--;
  }
  var prefix = str.substring(0, indexOfOpen);
  var suffix = str.substring(indexOfClose + 1, str.length);
  var simplified = simplifyWhenNoParentheses(str.substring(indexOfOpen + 1, indexOfClose));
  return simplifyWithParentheses(prefix + simplified.toString() + suffix);
}

function isOperator(c) {
  return (c == "+" || c == "-" || c == "*" || c == "/");
}

function isExpressionSyntacticallyCorrect(str) {
  // check that each character either is a number of is +, -, *, /, (, or )
  for (var i = 0; i < str.length; i++) {
    if (isNaN(str[i])) {
      var c = str[i];
      if (!(isOperator(c) || c == "(" || c == ")")) {
        return false;
      }
    }
  }
  // check that the parentheses open and close correctly
  var numberOfOpenParentheses = 0;
  for (var i = 0; i < str.length; i++) {
    if (str[i] == "(") numberOfOpenParentheses++;
    if (str[i] == ")") numberOfOpenParentheses--;
    if (numberOfOpenParentheses < 0) return false;
  }
  if (numberOfOpenParentheses != 0) return false;
  // check that there are never two operators in a row
  for (var i = 0; i < str.length - 1; i++) {
    if (isOperator(str[i]) || str[i] == "(") {
      if (isOperator(str[i+1]) || str[i+1] == ")") {
        return false;
      }
    }
  }
  return true;
}


// need to work on (6-4)*6(1) and generally make this cleaner
function makeParenthesesMultiplication(str) {
  for (var i = 0; i < str.length - 1; i++) {
    if (str[i] == ")") {
      if (!isNaN(str[i+1]) || str[i+1] == "(") {
        var multInserted = str.substring(0, i+1) + "*" + str.substring(i+1, str.length);
        return makeParenthesesMultiplication(multInserted);
      }
    } else if (str[i+1] == "(") {
      if (!isNaN(str[i]) || str[i+1] == ")") {
        var multInserted = str.substring(0, i+1) + "*" + str.substring(i+1, str.length);
        return makeParenthesesMultiplication(multInserted);
      }
    }
  }
  return str;
}

function removeSpaces(str) {
  var trimmed = "";
  for (var i = 0; i < str.length; i++) {
    if (str[i] != " ") {
      trimmed += str[i];
    }
  }
  return trimmed;
}

function evaluateExpression(str) {
  if (str.length == 0) return null;
  var expression = removeSpaces(str);
  if (isExpressionSyntacticallyCorrect(expression)) {
    expression = makeParenthesesMultiplication(expression);
    var answerString = simplifyWithParentheses(expression);
    return Number(answerString);
  } else {
    return null;
  }
}

function usesCorrectNumbers(numbersArray, str) {
  str = removeSpaces(str);
  var booleanArrayForNumbersUsed = [];
  for (var i = 0; i < numbersArray.length; i++) {
    booleanArrayForNumbersUsed.push(false);
  }
  var index = 0;
  while (index < str.length) {
    while(index < str.length && isNaN(str[index])) {
      console.log("skipping " + str[index]);
      index++;
    }
    var numberString = "";
    while(index < str.length && !isNaN(str[index])) {
      console.log("keeping " + str[index]);
      numberString += str[index];
      index++;
      console.log("current numberString is " + numberString);
    }
    if (numberString.length > 0) {
      var number = Number(numberString);
      console.log("found a number: " + number);
      var goodNumber = false;
      for (var i = 0; i < numbersArray.length; i++) {
        if (number == numbersArray[i] && booleanArrayForNumbersUsed[i] == false) {
          goodNumber = true;
          booleanArrayForNumbersUsed[i] = true;
          number = null;
        }
      }
      if (goodNumber == false) return false;
    }
  }
  for (var i = 0; i < booleanArrayForNumbersUsed.length; i++) {
    if (booleanArrayForNumbersUsed[i] == false) return false;
  }
  return true;
}




// The following are for interacting with the DOM, and might go in a different file

var cards = [];
var score = 0;

setup();

function setup() {
  cards = [];
  document.getElementById("answer").value = "";
  document.getElementById("output").innerHTML = "";
  document.getElementById("score").innerHTML = score;
  console.log("begin again");
  for (var i = 0; i < 4; i++) {
    cards.push(Math.floor(Math.random() * 10) + 1);
  }
  var cardDivs = document.getElementsByClassName("card");
  for (var i = 0; i < 4; i++) {
    console.log(cards[i]);
    cardDivs[i].innerHTML = cards[i];
  }
}

function processAnswer() {
  var input = document.getElementById("answer").value;
  var result = evaluateExpression(input);
  if (usesCorrectNumbers(cards, input) && result == 12) {
    document.getElementById("output").innerHTML = "SUCCESS";
    score++;
    setTimeout(function(){
      setup();
      }, 2000);
  } else {
    document.getElementById("output").innerHTML = result;
  }
}

function giveup() {
  score--;
  if (score < 0) score = 0;
  setup();
}