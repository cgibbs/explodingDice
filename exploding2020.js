rollExpDice = (numDice=1, isPipAvailable=0, passThresh=7, expThresh=9, pipBonus=1) => {
  if (numDice<1) return;
    let ret = 0;
  while (numDice>0) {
        rollVal = rollDice();
        if (rollVal >= passThresh) {
          ret +=1;
        } else if (isPipAvailable && rollVal+pipBonus >= passThresh) {
                    ret +=1;
                    isPipAvailable=0;   
                }
        if (rollVal < expThresh) numDice--;
    }   
    return ret;
}

rollExpDiceDefault = (isPipAvailable=0) => rollExpDice(1, isPipAvailable, 7, 9, 1)

Array.prototype.count = function() {
    return this.reduce(function(obj, name) {
        obj[name] = obj[name] ? ++obj[name] : 1;
        return obj;
    }, {});
}

runCounts = (diceFunc=rollExpDiceDefault, num=100) => [...Array(num)].map((a) => diceFunc()).count();
