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
	while(numChecks > 0) {
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

var successCheckExplodeNAttempts = (numChecks, numToBeat, n, checkVal=7) => {
	var attempts = 1;
	while(successCheckExplodeN(numChecks, n, checkVal) < numToBeat) attempts += 1;
	return attempts;
}

var successCheckExplodeTest = (numChecks, numToBeat, checkVal=7, numTries=1000) => {
	var count = 0.0;
	for(var i = 0; i < numTries; i++) {
		count += successCheckExplodeAttempts(numChecks, numToBeat, checkVal);
	}
	// console.log(`For ${numChecks} to beat ${numToBeat}, took ${numTries} to succeed ${count} times`);
	return (numTries / count);
}

var successCheckExplodeNTest = (numChecks, numToBeat, n, checkVal=7, numTries=1000) => {
	var count = 0.0;
	for(var i = 0; i < numTries; i++) {
		count += successCheckExplodeNAttempts(numChecks, numToBeat, n, checkVal);
	}
	// console.log(`For ${numChecks} to beat ${numToBeat}, took ${numTries} to succeed ${count} times`);
	return (numTries / count);
}

var numD10sToRoll = 10;
var minSuccessesForSuccess = 3;

successCheckExplodeTest(numD10sToRoll, minSuccessesForSuccess);

var odds = (numD10sToRoll, minSuccessesForSuccess) => console.log("Success odds are approx: ", 1.0 / successCheckExplodeTest(numD10sToRoll, minSuccessesForSuccess))

var oddsArr = (tn=7, explode=9, numTries=1000) => {
  var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  var arrArr = [];
  // initial entry into arrArr
  arrArr.push(arr.map((a) => (successCheckExplodeNTest(a, 1, explode, tn, numTries))));
    console.log(...arrArr[0].map((a) => a.toFixed(2)));
  for (let i = 2; i <= 10; i++) {
  	arrArr.push(arr.map((a, ind) => arrArr[i-2][ind] >= 0.01 ? (successCheckExplodeNTest(a, i, explode, tn, numTries)) : 0.0));
    console.log(...arrArr[i-1].map((a) => a.toFixed(2)));
  }
}

oddsArr(tn=7, explode=9, numTries=100000)


var oddsArrPip = () => {
	var arr = [...Array(20)].map((a, i) => i); // [1,2,..,20]
	// numDice = arr[i]/2
	// latestPip = arr[i]%2
	// assume all before have pip
	var arrArr = [];
	arrArr.push(arr.map)
	for (let i = 2; i < arr.length; i++) {
		

	}
}



/******* DON'T USE THIS WITH THE STUFF ABOVE, IT'S DIFFERENT *******/


var getRandomInt = (max) => (Math.floor(Math.random() * Math.floor(max))) + 1;
var rollDice = (die=10, numDice=1) => numDice > 0 ? getRandomInt(die) + rollDice(die, numDice - 1) : 0;

// lowered threshold applies only to wild die
var enpSuccesses = (level, tn=7, en=9) => {
	// remember that levels are zero-indexed
	var numSuccesses = [...Array(level < 2 ? 1 : ((level - level%2) / 2) + 1)].map((a) => rollDice());
	numSuccesses[0] = ((numSuccesses[0] == tn - 1) && level%2) ? (numSuccesses[0]+(level--%2)) : numSuccesses[0];
   	numSuccesses.forEach((a) => a >= en ? numSuccesses.push(rollDice()) : null);
	return numSuccesses.map((a) => a >= tn).reduce((acc, cur) => acc + cur, 0);
}

var successCheckENPAttempts = (level, numToBeat, tn=7, en=9, maxTries=1000) => {
	var attempts = 1;
	while((enpSuccesses(level, tn, en) < numToBeat) && attempts < maxTries) attempts += 1;
	return attempts;
}

var successCheckENPTest = (level, numToBeat, tn=7, en=9, numTries=1000) => {
	var count = 0.0;
	for(var i = 0; i < numTries; i++) {
		count += successCheckENPAttempts(level, numToBeat, tn, en);
	}
	return (numTries / count);
}

var oddsArrENP = (tn=7, en=9, numTries=1000) => {
  var arr = [...Array(20)].map((a, i) => i);
  var arrArr = [];
  // initial entry into arrArr
  arrArr.push(arr.map((a) => (successCheckENPTest(a, 1, tn, en, numTries))));
  console.log(...[...Array(20)].map((a, i) => i + 1).map((a) => a.toString().padStart(4)));
  console.log(...arrArr[0].map((a) => a.toFixed(2).padStart(4)));
  for (let i = 2; i <= 10; i++) {
  	arrArr.push(arr.map((a, ind) => (successCheckENPTest(a, i, tn, en, numTries*arrArr[i-2][ind]))));
    console.log(...arrArr[i-1].map((a) => a.toFixed(2)));
  }
}





// NOT USEFUL, BUT COOL
// var dice = [...Array(arr[i]/2 /*numDice*/)].map((a, i, tArr) => (i < tArr.length-1) || arr[i]%2 /*latestPip*/ ? () => rollDice() + 1 : () => rollDice());