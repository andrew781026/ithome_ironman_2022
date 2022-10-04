const regex = /[^\r\n\s]/gi;

const checker = str => !/[^\r\n\s\t]/gi.test(str);

console.log(regex.test('   '));
console.log(regex.test('  ada '));
console.log(regex.test('KING'));

console.log(checker('KING'));
console.log(checker('\r\n '));
