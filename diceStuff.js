var getRandomInt = (max) => (Math.floor(Math.random() * Math.floor(max))) + 1;
var rollDice = (die=10, numDice=1) => numDice > 0 ? getRandomInt(die) + rollDice(die, numDice - 1) : 0;
var successCheckSingle = (checkVal=7) => rollDice() >= checkVal;
var successArray = (numChecks, checkVal=7) => [...Array(numChecks)].map(() => successCheckSingle(checkVal));
var successCheck = (numChecks, checkVal=7) => successArray(numChecks, checkVal).reduce((acc, cur) => acc + cur);

var successArrayExplode = (numChecks, checkVal=7) => {
	var retArr = [];
	while(numChecks > -1) {
		retArr.push(successCheckSingle(checkVal));
		if(!retArr[retArr.length-1]) numChecks -= 1;
	}
	return retArr;
};

var successArrayExplodeN = (numChecks, n, checkVal=7) => {
	var retArr = [];
	while(numChecks > -1) {
		var roll = rollDice();
		retArr.push(roll >= checkVal);
		if(!(roll >= n)) numChecks -= 1;
	}
	return retArr;
}

var successCheckExplode = (numChecks, checkVal=7) => successArrayExplode(numChecks, checkVal).reduce((acc, cur) => acc + cur);

var successCheckExplodeN = (numChecks, n, checkVal=7) => successArrayExplodeN(numChecks, n, checkVal).reduce((acc, cur) => acc + cur);

var successCheckExplodeAttempts = (numChecks, numToBeat, checkVal=7) => {
	var attempts = 1;
	while(successCheckExplode(numChecks, checkVal) < numToBeat) attempts += 1;
	return attempts;
}

var successCheckExplodeNAttempts = (numChecks, numToBeat, n, checkVal=7, maxAttempts=1000) => {
	var attempts = 1;
	while(successCheckExplodeN(numChecks, n, checkVal) < numToBeat) attempts += 1;
	return attempts;
}

var successCheckExplodeTest = (numChecks, numToBeat, checkVal=7, numTries=1000) => {
	var count = 0;
	for(var i = 0; i < numTries; i++) {
		count += successCheckExplodeAttempts(numChecks, numToBeat, checkVal);
	}
	return count / numTries;
}

var successCheckExplodeNTest = (numChecks, numToBeat, n, checkVal=7, numTries=1000, maxAttempts=1000) => {
	var count = 0;
	for(var i = 0; i < numTries; i++) {
		count += successCheckExplodeNAttempts(numChecks, numToBeat, n, checkVal, maxAttempts);
	}
	return count / numTries;
}

var numD10sToRoll = 10;
var minSuccessesForSuccess = 3;

successCheckExplodeTest(numD10sToRoll, minSuccessesForSuccess);

var odds = (numD10sToRoll, minSuccessesForSuccess) => console.log("Success odds are approx: ", 1.0 / successCheckExplodeTest(numD10sToRoll, minSuccessesForSuccess))

var oddsArr = () => {
  var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  var arrArr = [];
  // initial entry into arrArr
  arrArr.push(arr.map((a) => (1.0 / successCheckExplodeNTest(a, 1, 9, 7, 1000, 1000))));
    console.log(...arrArr[0].map((a) => a.toFixed(2)));
  for (let i = 2; i <= 10; i++) {
  	arrArr.push(arr.map((a, ind) => arrArr[i-2][ind] >= 0.01 ? (1.0 / successCheckExplodeNTest(a, i, 9, 7, 1000, 1000)) : 0.0));
    console.log(...arrArr[i-1].map((a) => a.toFixed(2)));
  }
}