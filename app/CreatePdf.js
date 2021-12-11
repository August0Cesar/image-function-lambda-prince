const { spawn } = require('child_process')

module.exports = {
	create: create
}

async function create(html) {

	const p = new Promise((resolve) => {

		// const child = spawn('prince', [path_file]);//funcionando
		const child = spawn('prince', ["-", "-o", "out.pdf"]);
		child.stdin.write(html);
		child.stdin.end();

		child.stderr.on('data', (data) => {//saida do programa no terminal
			console.error(`stderr: ${data}`);
		});

		child.on('close', (code) => {

			console.log(`child process exited with code ${code}`);
			resolve("oi");
		});
	});
	return p;
}

