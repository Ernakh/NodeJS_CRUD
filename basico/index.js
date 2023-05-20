const e = require('express');
const express = require('express');
// const exphbs = require('express-handlebars');
const hbs = require("hbs");
const path = require('path');

// var bodyParser = require('body-parser');
// var jsonParser = bodyParser.json();
// var urlencodedParser = bodyParser.urlencoded({ extended: false });

const { Client } = require('pg')
 
const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'nodejs',
  user: 'admin',
  password: 'admin',
})

client.connect((err) => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
})

//Calling client.connect without a callback yields a promise:
// const { Client } = require('pg')
// const client = new Client()
// client
//   .connect()
//   .then(() => console.log('connected'))
//   .catch((err) => console.error('connection error', err.stack))

/*
CREATE TABLE pessoas(
    id SERIAL primary key,
	nome varchar(100) not null,
	ano_nascimento integer
);

insert into pessoas (nome, ano_nascimento) values ('Fabrício', 1990)

select * from pessoas

*/

//await banco.connect();
// const res = await banco.query('SELECT $1::text as message', ['Hello world!'])
// console.log(res.rows[0].message) // Hello world!
// await banco.end()



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

//  app.engine('handlebars', exphbs.engine({ extname: '.hbs', defaultLayout: "main"}));
//  app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: "main"}));
// app.engine('handlebars', exphbs())
// app.set('view engine', 'handlebars');

// app.engine('.hbs', exphbs({
//     defaultLayout: 'main',
//     extname: '.hbs',
//     layoutsDir: path.join(__dirname, 'views/layouts')
//   }))
//   app.set('view engine', '.hbs')
//   app.set('views', path.join(__dirname, 'views'))

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

app.get('/pessoas/:id', (req, res) => 
{
  const id = req.params.id;

  const sql = 
  {
    text:`select * from pessoas where id = $1`,
    values: [id]
  }

  client.query(sql,(err,data) => 
  {
    if(err)
    {
      console.log(err);
      return;
    }
    console.log(data.rows);
    // pessoas = JSON.parse(data);
    const pessoas = data.rows;
    res.render("pessoas", { layout: 'layouts/main', pessoas: pessoas });
  });
  
  //client.end();

});

app.get('/pessoas', (req, res) => 
{
  const sql = "select * from pessoas";

  client.query(sql, (err,data) => 
  {
    if(err)
    {
      console.log(err);
      return;
    }
    console.log(data.rows);
    // pessoas = JSON.parse(data);
    const pessoas = data.rows;
    res.render("pessoas", { layout: 'layouts/main', pessoas: pessoas });
  });
  
  //client.end();

});


app.post('/pessoa/:id', (req, res) => 
{
  const id = req.params.id;

  const sql = 
  {
    text:`delete from pessoas where id = $1`,
    values: [id]
  }

  client.query(sql, (err, res) => 
  {
    if(err) 
    {
      console.log(err);
    }

  });

  res.redirect('/pessoas');
});

app.post('/pessoa', (req, res) => 
{
  console.log(req.body);

  const nome = req.body.nome;
  const ano = req.body.ano;

  const sql = 
  {
    text:`insert into pessoas (nome, ano_nascimento) values ($1,$2)`,
    values: [nome, ano]
  }

  client.query(sql, (err, res) => 
  {
    if(err) 
    {
      console.log(err);
    }

  });

  //client.end();

  res.redirect('/pessoas');
  // res.render("pessoas", { layout: 'layouts/main' });
});


app.post('/editar', (req, res) => 
{
  console.log(req.body);

  const id = req.body.id;
  const nome = req.body.nome;
  const ano = req.body.ano;

  const sql = 
  {
    text:`update pessoas set nome= $1,  ano_nascimento = $2 where id = $3`,
    values: [nome, ano, id]
  }

  client.query(sql, (err, res) => 
  {
    if(err) 
    {
      console.log(err);
    }

  });

  //client.end();

  res.redirect('/pessoas');
});


app.get('/editar/:id', (req, res) => 
{
  const id = req.params.id;

  const sql = 
  {
    text:`select * from pessoas where id = $1`,
    values: [id]
  }

  client.query(sql, (err,data) => 
  {
    if(err)
    {
      console.log(err);
      return;
    }
    console.log(data.rows);
    // pessoas = JSON.parse(data);
    const pessoa = data.rows[0];
    res.render("editar", { layout: 'layouts/main', pessoa: pessoa });
  });
  
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