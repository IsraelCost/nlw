const express = require("express")
const server = express()

//pegar o banco de dados
const db = require("./database/db")


//configurar pasta pública

server.use(express.static("public"))

//habilitar o uso do req.body na nossa aplicação

server.use(express.urlencoded({extended: true}))
//utilizando template engine

const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})


//configurar caminhos da minha aplicação


//página inicial
//req: requisição
//res: resposta
server.get("/", (req, res) => {
    return res.render("index.html", {title: "Um título"})
})
server.get("/create-point", (req, res) => {
    //req.query: Query Strings da nossa url
    console.log(req.query)


    
    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    //req.body: o corpo do nosso formulário
    //console.log(req.body)
    //inserir dados no banco de dados
    const query = `
    INSERT INTO places (
        image,
        name,
        address,
        address2,
        state,
        city,
        items
    ) VALUES (?,?,?,?,?,?,?);
`
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err){
        if(err){
            console.log("Erro no cadastro")
            return res.render("create-point.html", { saved: false })
        }

        console.log("Cadastrado com sucesso")
        console.log(this)//não é possível usar arrow function com o this        
        return res.render("create-point.html", { saved: true })//usar send para enviar algo na página
        

    }


    db.run(query, values, afterInsertData)

})
server.get("/search", (req, res) => {
    //pegar os dados do banco de dados
    const search = req.query.search
    if(search == ""){
        return res.render("search-results.html", { total: 0 })
    }else{
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
        if(err){
            return console.log(err)
        }
        const total = rows.length

        //mostrar a página html com os dados do banco de dados 
    return res.render("search-results.html", { places: rows, total: total })
    })
}
    
})
//ligar o servidor

server.listen(3000)