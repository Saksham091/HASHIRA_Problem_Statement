const fs = require("fs");

function gcd(a, b) {
  a = BigInt(a);
  b = BigInt(b);
  while (b !== BigInt(0)) {
    [a, b] = [b, a % b];
  }
  return a;
}

function lcm(a, b) {
  return (BigInt(a) * BigInt(b)) / gcd(a, b);
}

function parseFunction(valueStr) {
  const match = valueStr.match(/(sum|add|multiply|mul|lcm|gcd|hcf)\((\d+),(\d+)\)/i);
  if (!match) return null;

  const fn = match[1].toLowerCase();
  const a = BigInt(match[2]);
  const b = BigInt(match[3]);

  switch (fn) {
    case "sum":
    case "add":
      return a + b;
    case "multiply":
    case "mul":
      return a * b;
    case "lcm":
      return lcm(a, b);
    case "gcd":
    case "hcf":
      return gcd(a, b);
    default:
      return null;
  }
}

function convertToBigInt(str, base) {
  const maybeFunc = parseFunction(str);
  if (maybeFunc !== null) return maybeFunc;

  let result = BigInt(0);
  for (let i = 0; i < str.length; i++) {
    const digit = parseInt(str[i], 36);
    result = result * BigInt(base) + BigInt(digit);
  }
  return result;
}

function lagrange(xVals, yVals) {
  let secret = BigInt(0);
  let k = xVals.length;

  for (let i = 0; i < k; i++) {
    let xi = xVals[i];
    let yi = yVals[i];
    let num = BigInt(1);
    let den = BigInt(1);

    for (let j = 0; j < k; j++) {
      if (i !== j) {
        num *= BigInt(0) - xVals[j];
        den *= xi - xVals[j];
      }
    }

    secret += (yi * num) / den;
  }

  return secret;
}

function getCombinations(arr, k) {
  let res = [];
  function helper(start, combo) {
    if (combo.length === k) {
      res.push(combo);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      helper(i + 1, combo.concat([arr[i]]));
    }
  }
  helper(0, []);
  return res;
}

function solve(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const n = data.keys.n;
  const k = data.keys.k;

  const points = [];

  for (let key in data) {
    if (key === "keys") continue;
    const x = BigInt(key);
    const y = convertToBigInt(data[key].value, parseInt(data[key].base));
    points.push({ x, y, id: key });
  }

  const combos = getCombinations(points, k);
  const cMap = new Map();
  const comboMap = new Map();

  for (let combo of combos) {
    const xVals = combo.map(p => p.x);
    const yVals = combo.map(p => p.y);
    try {
      const c = lagrange(xVals, yVals).toString();
      cMap.set(c, (cMap.get(c) || 0) + 1);
      if (!comboMap.has(c)) comboMap.set(c, []);
      comboMap.get(c).push(combo.map(p => p.id));
    } catch (e) {
    }
  }

  let correctC = "";
  let maxFreq = 0;
  for (let [c, freq] of cMap.entries()) {
    if (freq > maxFreq) {
      correctC = c;
      maxFreq = freq;
    }
  }

  const validCombos = comboMap.get(correctC) || [];
  const usedKeys = new Set(validCombos.flat());
  const allKeys = points.map(p => p.id);
  const faultyKeys = allKeys.filter(k => !usedKeys.has(k));

  return {
    secret: correctC,
    faulty: faultyKeys
  };
}

const test1 = solve("test1.json");
const test2 = solve("test2.json");

console.log("Secret 1:", test1.secret);
console.log("Faulty Key(s) in Test 1:", test1.faulty.length ? test1.faulty.join(", ") : "None");

console.log("Secret 2:", test2.secret);
console.log("Faulty Key(s) in Test 2:", test2.faulty.length ? test2.faulty.join(", ") : "None");
