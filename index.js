import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';

function autenticar(requisicao, resposta, next){
    if(requisicao.session.usuarioAutenticado){
        next();
    }else{
        resposta.redirect('/login.html');
    }
}
const app = express();
app.use(cookieParser());
app.use(session({
 secret: "M1nH4Ch4v3S3cR3t4",
 resave: false,
 saveUninitialized: true,
 cookie:{
    maxAge: 1000 * 60 * 30 
 }


}))

const porta = 3000;
const host ='0.0.0.0';
var listadepessoas = [];
var mensagenslancadas = [];

app.use(express.urlencoded({ extended: true }));


function processaCadastroUsuario(requisicao, resposta){
    let RespostaServer='';
    if(!(requisicao.body.nome && requisicao.body.idade && requisicao.body.Pessoa)){
        
        RespostaServer =`
        <!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }

        form {
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0px 0px 10px 0px #000000;
            padding: 20px;
            width: 80%;
            max-width: 600px;
        }

        legend {
            font-size: 1.5em;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 15px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            color: #555;
        }

        input {
            width: calc(100% - 16px);
            padding: 8px;
            box-sizing: border-box;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        .input-group {
            display: flex;
            align-items: center;
        }

        .input-group-text {
            background-color: #007bff;
            color: #fff;
            border: 1px solid #007bff;
            border-radius: 5px 0 0 5px;
            padding: 8px;
        }


        button {
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 5px;
            padding: 10px 20px;
            cursor: pointer;
        }

        button:hover {
            background-color: #0056b3;
        }
        </style>
    </head>
<body>
    <form action="/cadastrarUsuario" method="POST" class="row g-3 needs-validation" novalidate>
        <fieldset class="border p-2">
            <legend>Cadastro de Usuário</legend>
            <div class="col-md-4">
                <label for="nome" class="form-label">Nome:</label>
                <input type="text" class="form-control" id="nome" value="${requisicao.body.nome}" name="nome" >
                
            </div>
        `;
        if(!requisicao.body.nome){
            RespostaServer +=`<div>
                                <p class="text-danger">Por favor informe o nome!</p>
                                </div>`;
        } 
        RespostaServer +=`
        <div class="col-md-4">
                <label for="sobrenome" class="form-label">idade:</label>
                <input type="date" class="form-control" id="idade" value ="${requisicao.body.idade}" name="idade" >
               
                </div>`;
                if(!requisicao.body.idade)
                {
                    RespostaServer +=`<div>
                                    <p class="text-danger">Por favor informe a idade!</p>
                                    </div>`;
                }
                RespostaServer +=`
                <div class="col-md-4">
                <label for="username" class="form-label">Nome de Usuario:</label>
                    <input type="text" class="form-control" id="Pessoa" value ="${requisicao.body.Pessoa}" name="Pessoa"  >
                    <br>
                    `;
                    if(!requisicao.body.Pessoa)
                    {
                        RespostaServer +=`<div>
                                       <p class="text-danger">Por favor informe o usuário!</p>
                                       </div>`;
                    }
                    RespostaServer +=
                    
                    `
                    
                </div>
            </div>
            <div class="col-12">
            <button class="btn btn-primary mt-4" type="submit">Cadastrar</button>
        </div>
    </fieldset>
</form>

                `;
                resposta.end(RespostaServer);
            
    }
    else{
   const usuario = {
    nome: requisicao.body.nome,
    idade: requisicao.body.idade,
    Pessoa: requisicao.body.Pessoa

   } 
   listadepessoas.push(usuario);
   RespostaServer =`
    <!DOCTYPE html>
    <head>
    <meta charset="UTF-8">
    <title>Menu do sistema</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
      </head>
     <body>
        <h1> Lista de Usuários Cadastrados </h1>
        <table class="table table-striped table-hover">
        <thead>
        <tr>
            <th>Nome</th>
            <th>idade</th>
            <th>Nome de Usuário</th>
        <tr>
        </thead>
        <tbody>`;
        
    for(const usuario of listadepessoas){
        RespostaServer+=`
            <tr>
                <td>${usuario.nome}</td>
                <td>${usuario.idade}</td>
                <td>${usuario.Pessoa}</td>
            </tr>
            `;
        }

        RespostaServer+=`
                </tbody>
            </table>
            <a class="btn btn-primary" href="/"role="button">Voltar ao menu</a>
            <a class="btn btn-primary" href="/cadastraUsuario.html"role="button">Continuar Cadastrando</a>
        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </html>

        `;
        resposta.end(RespostaServer);
    }
}


app.use(express.static(path.join(process.cwd(), 'paginas')));

app.get('/',autenticar,(requisicao,resposta)=>{
    const dataUltimoAcesso = requisicao.cookies.DataUltimoAcesso; 
    const data = new Date();
    resposta.cookie("DataUltimoAcesso", data.toLocaleString(), {
    maxAge: 1000 * 60 * 60 * 24 * 30,

    httpOnly: true
    });
    resposta.end(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <title>Menu do sistema</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
    
            header {
                background-color: #333;
                color: #fff;
                text-align: center;
                padding: 10px;
            }
    
            h1 {
                margin-bottom: 0;
            }
    
            ul {
                list-style-type: none;
                padding: 0;
                margin: 20px 0;
                background-color: #333;
                overflow: hidden;
                display: flex;
                justify-content: space-between; /* Ajuste para espaçamento entre os itens */
            }
    
            li {
                /* float: left; Remova esta linha */
            }
    
            li a {
                display: block;
                color: white;
                text-align: center;
                padding: 14px 16px;
                text-decoration: none;
            }
    
            li a:hover {
                background-color: #555;
            }
    
            footer {
                background-color: #333;
                color: #fff;
                text-align: center;
                padding: 10px;
                position: fixed;
                bottom: 0;
                width: 100%;
            }

            .a {
                background-color: #3498db;
                color: #fff;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s;

            }

            .a:hover {
                background-color: #e74c3c;
            }

            
        </style>

    </head>
    
    <body>
        <header>
            <a href="/kill"><button class="ml-3 a ">Encerrar Sessão</button></a>

            <h1>Menu</h1>
        </header>
    
        <ul>
            <li><a href="/cadastraUsuario.html">Cadastrar Usuário</a></li>
            <li><a href="/Novamensagem">Batepapo</a></li>
        </ul>

        <footer>
            <p>Seu último acesso foi em: ${dataUltimoAcesso}</p>
        </footer>
    </body>
    
    </html>    
     `);

})

app.post('/login',(requisicao,resposta)=>{
    const Usu = requisicao.body.Usu;
    const Senha = requisicao.body.Senha;
    if(Usu && Senha && (Usu ==='Joao') && (Senha === '1234')) {
        requisicao.session.usuarioAutenticado = true;
        resposta.redirect('/');
    }
    else(
        resposta.end(`
            <!DOCTYPE html>
            <head>
            <meta charset="UTF-8">
            <title>Falha na autenticação</title>
            </head>
            <body>
            <h2>Usuario ou Senha invalidos!</h2>
            <a href="/login.html">Voltar ao Login</a>
            </body>
            </html>
        `)
    )
});
app.post( '/cadastrarUsuario',autenticar,processaCadastroUsuario);

app.get('/Novamensagem',autenticar,(requisicao,resposta)=>{

let RespostaServer = `<!DOCTYPE html>
    <html lang="pt-br">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            margin: 0;
            padding: 0;
        }

        a {
            text-decoration: none;
            color: #007bff;
            font-weight: bold;
            margin-top: 10px;
            display: inline-block;
            padding: 8px 12px;
            background-color: #007bff;
            color: #fff;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }
        
        a:hover {
            background-color: #0056b3;
        }

        h2 {
            color: #333;
            text-align: center;
        }

        .containerPrincipal {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .containerMsg {
            margin-bottom: 10px;
        }

        p {
            margin: 0;
        }

        .data {
            color: #888;
            font-size: 0.8em;
        }

        .mensagem {
            margin-top: 5px;
        }

        .hr {
            border: 0.5px solid #ddd;
        }
    </style>
</head>
<body>
<a href="/">Voltar ao Menu</a>
<h2>Batepapo</h2>
<div class="containerPrincipal">`;

   for(const mensagem of mensagenslancadas){
    RespostaServer += `
    <div class="Torpedo">
        <p>${mensagem.Pessoa}</p>
        <p class="data">${mensagem.data}</p>
        <p class="mensagem">${mensagem.Torpedo}</p>
    </div>
    <hr class="hr">`;
   }

   RespostaServer += `
</div>
<div class="formulario" style="max-width: 400px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <form action="/Novamensagem" method="POST">
        <select name="Pessoa" id="" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;">`;
        for(const usuario of listadepessoas){
            RespostaServer += `
            <option value="${usuario.Pessoa}">${usuario.Pessoa}</option>`;
        }
        RespostaServer += `
        </select>
        <input type="text" name="Torpedo">
        <button type="submit" style="background-color: #3498db; color: #fff; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">Enviar Torpedo</button>
    </form>
</div>
</body>
</html>`;
resposta.send(RespostaServer); 

})

app.post('/Novamensagem', autenticar, (requisicao, resposta) => {
    const usuario = requisicao.body.Pessoa;
    const TorpedoTorpedo = requisicao.body.Torpedo;
  
    if (usuario && TorpedoTorpedo) {
      const data = new Date().toLocaleString();
  
      const TorpedoTNEW = {
        Pessoa: usuario,
        Torpedo: TorpedoTorpedo,
        data,
      };
  
      mensagenslancadas.push(TorpedoTNEW);
  
      resposta.redirect('/Novamensagem');
    } else {
      resposta.redirect
    }
    resposta.end(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Erro no Torpedo</title>

        <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #2c3e50; /* Cor de fundo */
            color: #ecf0f1; /* Cor do texto */
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }

        h1 {
            color: #e74c3c; /* Cor do título */
            text-align: center;
        }

        a {
            text-decoration: none;
            color: #3498db; /* Cor do link */
            font-weight: bold;
        }

        a:hover {
            text-decoration: underline;
        }

        .container {
            margin-top: 20px;
        }
    </style>
    </head>
    <body>
            <h1>Mensagem inválida</h1>
            <div class="container">
            <a href="/Novamensagem">Voltar</a>
            </div>
    </body>
    </html>
  `);
});

app.get('/kill', SairLula);

function SairLula(requisicao,resposta)   {
    requisicao.session.usuarioAutenticado = false;
    resposta.redirect('/login.html');
}

app.listen(porta,host,()=>{
    console.log(`Servidor executado na url http://${host}:${porta}`);   
});
