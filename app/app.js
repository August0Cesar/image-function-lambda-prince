"use strict";
var execFile = require('child_process').execFile;

exports.handler = async (event, context, done) => {
    

    if (!event || !event.body) { return done(new Error("No data.")); }

    if (!event || !event.body) {
        const response_error = {
            statusCode: 500,
            body: JSON.stringify('Não veio body!'),
        };
        return response_error;
    }

    let body = event.body;

    if (event.isBase64Encoded) {
        body = Buffer.from(body, "base64").toString("ascii");
    }

    let html = await tinyMultipartParser(body);

    let opts = { timeout: 10 * 1000, maxbuffer: 10 * 1024 * 1024, encoding: "buffer" };
    
    console.log("Iniciando execução do prince");

    await makeFIle(html, opts);

    console.log("Finalizado execução do prince");
};

async function makeFIle(html, opts){
    let child = execFile("./prince-12.5.1-alpine3.10-x86_64/lib/prince/bin/prince", ["-", "-o", "-"], opts, function (err, stdout, stderr) {
        if (err) { return done(err); }
        if (err === null && (m = stderr.toString().match(/prince:\s+error:\s+([^\n]+)/))) {
            return done(new Error(m[1]));
        }
        console.log(stdout.toString("base64"))
        done(null, {
            "isBase64Encoded": true,
            "statusCode": 200,
            "headers": { "Content-Type": "application/pdf" },
            "body": stdout.toString("base64")
        });
    });
    child.stdin.write(html);
    child.stdin.end();
}


async function tinyMultipartParser(data) {
    // assume first line is boundary
    const lines = data.split("\r\n");
    const boundary = lines[0];
    const endboundary = boundary + "--";
    const boundaries = lines.filter(l => l == boundary).length;
    if (boundaries != 1) { throw new Error(`Unexpected boundaries ${boundaries}`); }
    const endboundaries = lines.filter(l => l == endboundary).length;
    if (endboundaries != 1) { throw new Error(`Unexpected end boundaries ${boundaries}`); }
    const output = [];
    let in_body = false;
    lines.forEach(line => {
        if (line.trim() == "" && !in_body) { in_body = true; return; }
        if (!in_body && line.match(/^content-type: /i) && !line.match(/text\/html/)) { throw new Error("not html"); }
        if (line.indexOf(boundary) > -1) return;
        if (in_body) output.push(line);
    })
    return output.join("\n");
}
