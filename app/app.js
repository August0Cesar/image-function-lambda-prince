
// https://newbedev.com/pipe-a-stream-to-s3-upload


const CreatePdf = require('./CreatePdf.js');

const AWS = require('aws-sdk');
const S3  = new AWS.S3();


exports.handler = async (event, context, done) => {

    try{
        console.log(event);
        let payload = JSON.parse(event.body);
        
        //let html = await getHtml(event);
        let html = payload.html;
        console.log('html',html);

        console.log('gerando pdf');
        let buffer = await CreatePdf.create(html);

        console.log('enviando pdf ao s3');
        
        let url = await sendS3( buffer, payload.toS3.bucket , payload.toS3.key );

        console.log('done');

        return {
            statusCode: 200
            ,body : JSON.stringify({
                url : url
                , fileLength : buffer.length
            })
        }

    }catch( er ){
        console.log('erro',er);
        return {
          statusCode: 500,
          body: er
        };
    }
    
}



async function sendS3( pdfBuffer, bucketName, objectKey ) {
    //let bucketName = 'wipaim-sults-dev';
    //let objectKey = 'pdf/prince.pdf';
    await S3.putObject({
        Body : pdfBuffer
        ,Bucket: bucketName
        ,Key: objectKey
        ,ContentType: 'application/pdf'
        ,ACL: "public-read"
    }).promise();

    return 'https://'+bucketName+'.s3.amazonaws.com/'+objectKey;
}

async function getHtml ( event ) {
    let body = event.body;

    if (event.isBase64Encoded) {
        body = Buffer.from(body, "base64").toString()//Default utf-8
        // toString("ascii");
    }

    return body;
}



function response400(message){
    return {
      statusCode: 400
      ,headers: { 'Content-Type': 'application/json' }
      ,body: JSON.stringify({'message':message})
    }
}



