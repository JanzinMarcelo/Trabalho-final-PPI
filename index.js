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
    maxAge: 1000 * 60 * 15 //15 min
 }


}))

const porta = 3000;
const host ='0.0.0.0';
var listaUsuarios = [];
app.use(express.urlencoded({ extended: true }));


function processaCadastroUsuario(requisicao, resposta){
    let conteudoResposta='';
    if(!(requisicao.bodyNome && requisicao.bodySobrenome && requisicao.bodyNomeUsuario)){
        resposta.status(400).send('Faltam dados do usuário!');
        conteudoResposta =`
        <!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
</head>
<body>
    <form action="/cadastrarUsuario" method="POST" class="row g-3 needs-validation" novalidate>
        <fieldset class="border p-2">
            <legend>Cadastro de Usuário</legend>
            <div class="col-md-4">
                <label for="nome" class="form-label">Nome:</label>
                <input type="text" class="form-control" id="nome" name="nome" >
                <div class="invalid-feedback">
                    Digite seu nome!
                </div>
            </div>
        `;
        if(!requisicao.body.nome){
            conteudoResposta +=`<div>
                                <p> class="text-danger">Por favor informe o nome!</p>
                                </div>`;
        } 
        conteudoResposta +=`
        <div class="col-md-4">
                <label for="sobrenome" class="form-label">senha:</label>
                <input type="text" class="form-control" id="idade" name="idade" >
                <div class="invalid-feedback">
                    Digite seu Email!
                </div>
                </div>`;
                if(!requisicao.body.idade)
                {
                    conteudoResposta +=`<div>
                                    <p> class="text-danger">Por favor informe a idade!</p>
                                    </div>`;
                }
                conteudoResposta +=`
                <div class="col-md-4">
                <label for="username" class="form-label">Email:</label>
                <div class="input-group has-validation">
                    <span class="input-group-text" id="inputGroupPrepend">@</span>
                    <input type="text" class="form-control" id="username" name="NomeUsuario" aria-describedby="inputGroupPrepend" >
                    <div class="invalid-feedback">
                        Digite seu nome de usuário!
                    </div>
                </div>
            </div>
                `;
             if(!requisicao.body.NomeUsuario)
             {
                conteudoResposta +=`<div>
                                <p> class="text-danger">Por favor informe o nome de usuário!</p>
                                </div>`;
             }
    }
    else{
   const usuario = {
    nome: requisicao.body.nome,
    Sobrenome: requisicao.body.Sobrenome,
    NomeUsuario: requisicao.body.NomeUsuario

   } 
   listaUsuarios.push(usuario);
    conteudoResposta =`
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
        
    for(const usuario of listaUsuarios){
            conteudoResposta+=`
            <tr>
                <td>${usuario.nome}</td>
                <td>${usuario.idade}</td>
                <td>${usuario.NomeUsuario}</td>
            </tr>
            `;
        }

        conteudoResposta+=`
                </tbody>
            </table>
            <a class="btn btn-primary" href="/"role="button">Voltar ao menu</a>
            <a class="btn btn-primary" href="/cadastraUsuario.html"role="button">Continuar Cadastrando</a>
        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </html>

        `;
        resposta.send(conteudoResposta);
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
    <head>
    <meta charset="UTF-8">
    <title>Menu do sistema</title>
      </head>
     <body>
        <h1> Menu </h1>
        <ul>
            <li><a href="/cadastraUsuario.html">Cadastrar Usuário</a></li>
         </ul>
    </body>
    <footer>
    <p>Seu ultimo acesso foi em: ${dataUltimoAcesso}</p>
    </footer>
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
    


app.listen(porta,host,()=>{
    console.log(`Servidor executado na url http://${host}:${porta}`);   
});
