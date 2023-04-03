const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database")
const Pergunta = require("./database/pergunta");
const Resposta = require("./database/Resposta");
//Database

connection.authenticate().then(() => {
    console.log("Conexão estabelecida com o banco de dados!")
})
.catch((msgErro) => {
    console.log(msgErro);
})


app.set(`view engine`, `ejs`); //Diz ao express para usar o EJS como view engine
app.use(express.static(`public`));
//body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//Routes
app.get("/", (req, res) => {  
    Pergunta.findAll({ raw: true, order: [
        ['id', 'DESC']  // DESC = decrescente, ASC = crescentes
    ]}).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        });
    });         
});

app.get("/perguntar", (req, res) => {
    res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/");
    });
});

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if (pergunta != undefined){

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [
                    ['id', 'DESC']
                ]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });            
        }else{
            res.redirect("/");
        }
    });
})

app.get("/success", (req, res) => {
    res.render("Success");
})

app.post("/responder", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {               
        res.redirect("/success");        
    });
});

app.listen(4000, () => {
    console.log("Servidor iniciado!");
});