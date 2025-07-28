const fs = require('fs');

function baseToDecimal(value, base) {
    return parseInt(value, base);
}

function lagrangeInterpolation(points) {
    const n = points.length;
    let result = 0;
    
    for (let i = 0; i < n; i++) {
        let term = points[i].y;
        
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                term = term * (0 - points[j].x) / (points[i].x - points[j].x);
            }
        }
        
        result += term;
    }
    
    return Math.round(result);
}

function findSecret(jsonData) {
    const keys = jsonData.keys;
    const n = keys.n;
    const k = keys.k;
    
    console.log(`n (total roots): ${n}, k (minimum required): ${k}`);
    
    const points = [];
    
    let count = 0;
    for (let key in jsonData) {
        if (key !== 'keys' && count < k) {
            const x = parseInt(key);
            const base = parseInt(jsonData[key].base);
            const encodedValue = jsonData[key].value;
            
            const y = baseToDecimal(encodedValue, base);
            
            points.push({ x: x, y: y });
            console.log(`Point ${count + 1}: (${x}, ${y}) [decoded from base ${base}]`);
            count++;
        }
    }
    
    const secret = lagrangeInterpolation(points);
    return secret;
}

const testCase1 = {
    "keys": {
        "n": 4,
        "k": 3
    },
    "1": {
        "base": "10",
        "value": "4"
    },
    "2": {
        "base": "2", 
        "value": "111"
    },
    "3": {
        "base": "10",
        "value": "12"
    },
    "6": {
        "base": "4",
        "value": "213"
    }
};

const testCase2 = {
    "keys": {
        "n": 10,
        "k": 7
    },
    "1": {
        "base": "6",
        "value": "13444211440455345511"
    },
    "2": {
        "base": "15",
        "value": "aed7015a346d63"
    },
    "3": {
        "base": "15",
        "value": "6aeeb69631c227c"
    },
    "4": {
        "base": "16",
        "value": "e1b5e05623d881f"
    },
    "5": {
        "base": "8",
        "value": "316034514573652620673"
    },
    "6": {
        "base": "3",
        "value": "2122212201122002221120200210011020220200"
    },
    "7": {
        "base": "3",
        "value": "20120221122211000100210021102001201112121"
    },
    "8": {
        "base": "6",
        "value": "20220554335330240002224253"
    },
    "9": {
        "base": "12",
        "value": "45153788322a1255483"
    },
    "10": {
        "base": "7",
        "value": "1101613130313526312514143"
    }
};

function saveTestCases() {
    fs.writeFileSync('testcase1.json', JSON.stringify(testCase1, null, 2));
    fs.writeFileSync('testcase2.json', JSON.stringify(testCase2, null, 2));
    console.log('Test cases saved to testcase1.json and testcase2.json');
}

function main() {
    console.log('=== Shamir\'s Secret Sharing - Finding Polynomial Constants ===\n');
    
    saveTestCases();
    
    console.log('SOLVING TEST CASE 1:');
    console.log('====================');
    try {
        const data1 = JSON.parse(fs.readFileSync('testcase1.json', 'utf8'));
        const secret1 = findSecret(data1);
        console.log(`Secret (constant term) for Test Case 1: ${secret1}\n`);
    } catch (error) {
        console.error('Error solving test case 1:', error.message);
    }
    
    console.log('SOLVING TEST CASE 2:');
    console.log('====================');
    try {
        const data2 = JSON.parse(fs.readFileSync('testcase2.json', 'utf8'));
        const secret2 = findSecret(data2);
        console.log(`Secret (constant term) for Test Case 2: ${secret2}\n`);
    } catch (error) {
        console.error('Error solving test case 2:', error.message);
    }
    
    console.log('=== FINAL RESULTS ===');
    const data1 = JSON.parse(fs.readFileSync('testcase1.json', 'utf8'));
    const data2 = JSON.parse(fs.readFileSync('testcase2.json', 'utf8'));
    
    const secret1 = findSecret(data1);
    const secret2 = findSecret(data2);
    
    console.log(`Test Case 1 Secret: ${secret1}`);
    console.log(`Test Case 2 Secret: ${secret2}`);
}

main();
