# Image Prince Function Lambda AWS


Esta é uma imagem baseda na imagem **node:14-alpine3.12** , que executa um uma função nodejs chamada handler para gerar um pdf a partir de um conteúdo html.


## Features

- Recceber um html e retornar um pdf a partir do mesmo.

## Tech

Image Prince Function Lambda ultiliza as seguintes tecnologias::

- [Docker](https://www.docker.com) - Para criação da Imagem que será publicada em um repositório no ECR (Elastic Container Registry)
- [Prince](https://www.princexml.com) - Técnologia para gerar pdf a partir de um html.
- [Nodejs](https://nodejs.org/en/) - Para função handler que será executada no serviço Amazon Lambda.

## Installations

##### Docker
Instalar o [Docker](https://docs.docker.com/engine/install/ubuntu/) na sua máquina.

##### NodeJs
Instalar o [NodeJs](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04-pt) na sua máquina.

##### AWS cli
Instalar o [AWS clis](https://docs.aws.amazon.com/pt_br/cli/latest/userguide/install-cliv2-linux.html) na sua máquina.

## Development

Após baixar esse proje na sua máquina entre na pasta app e rode o comando para baixar as dependências do node para o projeto.
```
npm install
```

Para testar a função na sua máquina, dentro da pasta app adicione o seguinte códio abaixo no final do arquivo app.js.
**Observação** o valor do body `"body": <base64-do-seu-html>` na variável `eventTest` deve ser substituído pela string base64 do seu html.

```
var eventTest = {
    "version": "2.0",
    "routeKey": "POST /function-prince",
    "rawPath": "/function-prince",
    "rawQueryString": "",
    "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        "cache-control": "max-age=0",
        "content-length": "26007",
        "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryBbWZpYWKBQH3pQ0O",
        "host": "99zctppp50.execute-api.us-east-1.amazonaws.com",
        "origin": "null",
        "sec-ch-ua": "\"Google Chrome\";v=\"95\", \"Chromium\";v=\"95\", \";Not A Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Linux\"",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "cross-site",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
        "x-amzn-trace-id": "Root=1-61aac956-70a736c95e524ad44254b27a",
        "x-forwarded-for": "189.101.55.213",
        "x-forwarded-port": "443",
        "x-forwarded-proto": "https"
    },
    "requestContext": {
        "accountId": "346872438780",
        "apiId": "99zctppp50",
        "domainName": "99zctppp50.execute-api.us-east-1.amazonaws.com",
        "domainPrefix": "99zctppp50",
        "http": {
            "method": "POST",
            "path": "/function-prince",
            "protocol": "HTTP/1.1",
            "sourceIp": "189.101.55.213",
            "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
        },
        "requestId": "JzRlli3pIAMESlQ=",
        "routeKey": "POST /function-prince",
        "stage": "$default",
        "time": "04/Dec/2021:01:50:14 +0000",
        "timeEpoch": 1638582614768
    },
    "body": "<base64-do-seu-html>",
    "isBase64Encoded": true
}
var contextTest = {
    "callbackWaitsForEmptyEventLoop": true,
    "functionVersion": "$LATEST",
    "functionName": "prince",
    "memoryLimitInMB": "128",
    "logGroupName": "/aws/lambda/prince",
    "logStreamName": "2021/11/06/[$LATEST]172f46b086884324b27097a97988bae2",
    "invokedFunctionArn": "arn:aws:lambda:sa-east-1:346872438780:function:prince",
    "awsRequestId": "753813a4-f95f-4db4-8ed9-7cb796b89ee9"
}

function doneTest(finished) {
    if (!finished) {
        toWrap.apply(null, arguments);
        finished = true;
    }
}

exports.handler(eventTest, contextTest, doneTest);
```
A função handler será chamada passando os parametros necessários para que ela seja executada. Então execute o seguinte comando para executar o código.

```
node app.js
```
- Em produção esse código não deve estar no seu arquivo app.js apenas para teste local.


## Building imagem para push no Elastic Container Register

Após concluir os testes da função no arquivo app.js vá para a raiz do projeto e excutes os passos abaixo para gerar a imagem e subir a mesma para o repositório no ERC na Amazon.

1. Crie as variáveis de ambiente com as configurações.

> export AWS_ACCESS_KEY_ID=SUAKEYID...

> export AWS_SECRET_ACCESS_KEY=SUASECRET...

>export AWS_DEFAULT_REGION=Sua região exemplo `us-east-1`


2. Configure o seu AWS cli

Preencher informações como AWS Access Key ID e AWS Secret Access Key e região

> aws configure


3. Autentique a CLI do Docker no seu registro do Amazon ECR.

> aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 346872438780.dkr.ecr.us-east-1.amazonaws.com

Esse comando irá gerar o token na sua máquina no arquivo `.docker/config.json`

4. Criar o repositório de imagens docker na aws.

> aws ecr create-repository --repository-name function-prince --image-scanning-configuration scanOnPush=true --image-tag-mutability MUTABLE

Saída:
```json
{
    "repository": {
        "repositoryArn": "arn:aws:ecr:us-east-1:346..:repository/function-prince",
        "registryId": "346..",
        "repositoryName": "function-prince",
        "repositoryUri": "346...dkr.ecr.us-east-1.amazonaws.com/function-prince",
        "createdAt": "2021-11-27T00:35:58-03:00",
        "imageTagMutability": "MUTABLE",
        "imageScanningConfiguration": {
            "scanOnPush": true
        },
        "encryptionConfiguration": {
            "encryptionType": "AES256"
        }
    }
}

```
5. Gerar a imagem a partir do arquivo Dockerfile
```
docker build . -t function-prince
```

6. Push da imagem cria para o repositório.
```
docker tag function-prince:latest 346...dkr.ecr.us-east-1.amazonaws.com/function-prince:latest
docker push 346...dkr.ecr.us-east-1.amazonaws.com/function-prince:latest
```
