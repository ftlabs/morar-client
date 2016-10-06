const fs = require('fs');
const morar = require('./index.js').config();

morar("sdlkfjsdflksdfjsdlfjsdfljsdfjlskdfjlsdjfsdjfjl", {banana : 'lasagne'})
	.then(res => {
		console.log(res);
	})
	.catch(err => {
		console.log(err);
	})
;
// morar(fs.readFileSync('/Users/sean.tracey/Downloads/773ee6b3-1ea2-41c0-864f-6b0d76e17871.gif'));

/*morar(fs.createReadStream('/Users/sean.tracey/Downloads/773ee6b3-1ea2-41c0-864f-6b0d76e17871.gif'))
	.catch(err => {
		console.log(err);
	})
;*/