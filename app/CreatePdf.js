const { spawn } = require('child_process');
var fs = require('fs');

module.exports = {
	create: create
}

async function create(html) {
	console.log('creating;');
	const p = new Promise((resolve) => {

		//let prince = 'prince';
		let prince = './prince-12.5.1-alpine3.10-x86_64/lib/prince/bin/prince';

		// const child = spawn('prince', [path_file]);//funcionando
		const child = spawn(prince, ["-", "-o", "/tmp/out.pdf"]);
		child.stdin.write(html);
		child.stdin.end();

		child.stderr.on('data', async (data) => {//saida do programa no terminal
			console.error(`stderr: ${data}`);
		});

		child.on('close', async (code) => {
			//console.log(`child process exited with code ${code}`);
			

			let pdfBuffer = await fs.readFileSync('/tmp/out.pdf');
			resolve(pdfBuffer);

		});
	});
	return p;
}

