"use strict";
var execFile = require('child_process').execFile;
var Promise = require('bluebird');


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
        body = Buffer.from(body, "base64").toString()//Default utf-8
        // toString("ascii");
    }

    let html = await tinyMultipartParser(body);

    let opts = { timeout: 10 * 1000, maxbuffer: 10 * 1024 * 1024, encoding: "buffer" };

    try {
        let pdfBase64 = await execPromise(html, opts, done);

        let retornoFinal = {
            "isBase64Encoded": true,
            "statusCode": 200,
            "headers": { "Content-Type": "application/pdf;charset=UTF-8" },
            "body": pdfBase64
        }
        return retornoFinal
    } catch (e) {

        console.log("Error =>  " + e.message);
    }
};

function execPromise(html, opts, done) {

    console.log("Iniciando execução do prince");

    return new Promise(function (resolve, reject) {
        let child = execFile("./prince-12.5.1-alpine3.10-x86_64/lib/prince/bin/prince", ["-", "-o", "-"], opts, function (err, stdout, stderr) {
        //teste local
        // let child = execFile("prince", ["-", "-o", "-"], opts, function (err, stdout, stderr) {
            if (err) { return done(err); }
            
            resolve(stdout.toString("base64"));

        });
        child.stdin.write(html);
        child.stdin.end();
    });
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

