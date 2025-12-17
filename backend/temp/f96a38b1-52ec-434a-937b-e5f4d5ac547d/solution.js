	var reverseString = function(s) {

	    const n = s.length;

	    const T = [];

	    for (let i = n - 1; i >= 0; i--) {

	        T.push(s[i]);

	    }

	    for (let i = 0; i < n; i++) {

	        s[i] = T[i];

	    }

	};


// Test cases
let test1 = ["h","e","l","l","o"];
reverseString(test1);
console.log(test1); // Expected: ["o","l","l","e","h"]

let test2 = ["H","a","n","n","a","h"];
reverseString(test2);
console.log(test2); // Expected: ["h","a","n","n","a","H"]