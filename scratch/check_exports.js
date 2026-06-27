const lucide = require('lucide-react');
console.log('GitHub' in lucide ? 'GitHub is present' : 'GitHub is NOT present');
console.log('Github' in lucide ? 'Github is present' : 'Github is NOT present');
console.log(Object.keys(lucide).filter(k => k.toLowerCase().includes('git')));
