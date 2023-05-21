const e = require('express');
const express = require('express');
// const exphbs = require('express-handlebars');
const hbs = require("hbs");
const path = require('path');

const conn = require('./db/conn');

const Pessoa = require('./models/Pessoa');

const app = express();

app.set("view engine", "hbs");
app.set("views", path.join(__dirname,"/views"));
app.set("layouts", path.join(__dirname,"/views/layouts"));
app.set("partials", path.join(__dirname,"/views/partials"));
hbs.registerPartials(path.join(__dirname, "/views/partials"));

app.use(express.static('public'));

app.use(
  express.urlencoded({
    extended: true,
  }),
)

app.get('/blog', (req, res) => {
    const posts = [
        {
          title: "Node.js",
          body: "Node.js é muito utilizado na programação hoje em dia",
        },
        {
          title: "PHP em 2023?",
          body: "A resposta é NÃOOOOOOO",
        },
        {
          title: "C#",
          body: "cooooll",
        },
      ];
    
      res.render("blog", { layout: 'layouts/main', posts });
});

app.get('/pessoa', (req, res) => 
{
    res.render("cadastro", { layout: 'layouts/main' });
});

app.get('/pessoas/:id', async (req, res) => 
{
  const id = req.params.id;

  const pessoas = await Pessoa.findAll({raw:true, where: {id:id}});
  // const pessoas = await Pessoa.findOne({raw:true, where: {id:id}});//funciona da mesma forma, mas retorna o objeto e não um array

  res.render("pessoas", { layout: 'layouts/main', pessoas: pessoas });

});

app.get('/pessoas', async (req, res) => 
{
  const pessoas = await Pessoa.findAll({raw:true});//raw para vir como vetor//remover quando tem relacionamentos

  res.render("pessoas", {layout: 'layouts/main', pessoas:pessoas});
});

app.post('/pessoa/:id', async (req, res) => 
{
  const id = req.params.id;

  await Pessoa.destroy({where:{id:id}});

  res.redirect('/pessoas');
});

app.post('/pessoa', async (req, res) => 
{
  console.log(req.body);

  const nome = req.body.nome;
  const ano = req.body.ano;

  await Pessoa.create({nome: nome, ano_nascimento:ano});

  res.redirect('/');
});


app.post('/editar', async (req, res) => 
{
  console.log(req.body);

  const id = req.body.id; 
  const nome = req.body.nome;
  const ano = req.body.ano;

  const pessoaNew = 
  {
    id,
    nome,
    ano_nascimento:ano
  }

  await Pessoa.update(pessoaNew, { where:{id:id}});
  

  res.redirect('/pessoas');
});


app.get('/editar/:id', async (req, res) => 
{
  const id = req.params.id;

  const pessoa = await Pessoa.findOne({raw:true, where:{id:id}});
  
  res.render("editar", { layout: 'layouts/main', pessoa: pessoa });
  
});

app.get('/', function (req, res) 
{
    const itens = ["a", "b", "c", "d"]

    const user = 
    {
        name: "Fabrício",
        surname: "Tonetto Londero",
        age: 32,
        maior: 15>=18?true:false
    }

    res.render('home', 
    { 
        layout: 'layouts/main',
        user: user,
        itens: itens
    });
});

app.listen(3000, () => 
{
    console.log('rodando...');
});


// conn.sync().then(() => 
// {
//   app.listen(3000);
//   console.log('rodando...');
// });