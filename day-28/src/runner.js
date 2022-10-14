import {parser} from '../dist/lang.js';

const str = '(a+1)';
const tree = parser.parse('(a+1)');
const cursor = tree.cursor();

tree.iterate({
  enter(node) {
    const originStr = str.substring(node.from, node.to);
    console.log('type=',node.name,' \t (from,to) =',`(${node.from},${node.to})`,' \t對應字串 =',originStr);
  },
});

do {
  console.log(cursor.type.name);
} while (cursor.next())

console.log('\n-------------------------------\n');

const tree2 = parser.parse('( 100 -(2+4))');
const cursor2 = tree2.cursor();

do {
  console.log(cursor2.type.name);
} while (cursor2.next())
