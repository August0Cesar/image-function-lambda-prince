module.exports = {
  create: create
}


async function create( html ){
	let buffer = null;
	return buffer;
}



async function createPdf2( html ){



	let opts = { timeout: 60 * 1000, maxbuffer: 1000 * 1024 * 1024, encoding: "buffer" };


	/*
	const p = new Promise((resolve) => {


		let child = execFile(prince, ["-", "-o", "-"], opts, function (err, stdout, stderr) {
			console.log(err);

			let b64 = stdout.toString("base64");
			resolve('foi');
		});
		child.stdin.write(html);
	    child.stdin.end();



	});
	*/

	const p = new Promise((resolve) => {


		let child = spawn(prince, ["-", "-o", "-"], opts, function (err, stdout, stderr) {
			console.log(err);

			let b64 = stdout.toString("base64");
			resolve('foi');
		});
		child.stdin.write(html);
	    child.stdin.end();



	});


	return p;
}

