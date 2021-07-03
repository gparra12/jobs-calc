const express = require("express"); // importa o node express
const routes = express.Router() // cria as rotas

const views = __dirname + "/views/"

const profile = // objeto profile
{
    name: "Gui", // nome do perfil
    avatar: "https://avatars.githubusercontent.com/u/62032974?v=4", // foto de perfil
    "monthly-budget": 3000, // orçamento mensal
    "days-per-week": 5, // dias de trabalho por semana
    "hours-per-dary": 5, // horas de trabalho por dia
    "vacation-per-year": 4, // semanas de férias por ano
    "value-hour": 60 // valor/hora
}

const Job = // objeto job
{
    data: // dados do objeto job
    [
        {
            id: 1, // id do job
            name: "Pizzaria Guloso", // nome do job
            "daily-hours": 2,  // dias de trabalho por dia
            "total-hours": 1,  // horas de total
            created_at: Date.now(), // dia de criação do job
        },
        {
            id: 2, // id do job
            name: "OneTwo Project", // nome do job
            "daily-hours": 3,  // dias de trabalho por dia
            "total-hours": 47,  // horas de total
            created_at: Date.now(), // dia de criação do job
        }
    ],

    controllers: 
    {
        index(req, res) { // atualiza a lista de jobs
            const updatedJobs = Job.data.map((job) => { 
                const remaining = Job.services.getRemainingDays(job) // calcula quantos dias falta
                const status = remaining <= 0 ? "done" : "progress" // condicional pra descobrir o status do job (Encerrado/Em andamento)
            
                return {
                    ...job, // pra não digitar todos dados do objeto de novo
                    remaining, 
                    status,
                    budget: profile["value-hour"] * job["total-hours"] // preço do job
                }
            })
            
            return res.render(views + "index", {profile, jobs : updatedJobs}) // retorna o objeto job atualizado
        },

        create(req, res) { // função para criar o job
            const lastId = Job.date[Job.data.length - 1]?.id || 1; // calcula o id
        
            jobs.push({ // coloca o objeto dentro da lista
                id: lastId + 1,
                name: req.body.name,
                "daily-hours": req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                created_at: Date.now()
            })

            return res.redirect('/') // após criar o job retorna pra página inicial
        },
    },

    services: 
    {
        getRemainingDays(job) { // função que calcula quantos dias faltam pro prazo
            const remaingDays = (job["total-hours"] / job["daily-hours"]).toFixed() // calcula o prazo máximo de entrega
        
            const createdDate = new Date(job.created_at) // cria o objeto data
            const dueDay = createdDate.getDate() + Number(remaingDays)
            const dueDate = createdDate.setDate(dueDay)
        
            const timeDifferenceInMiliseconds = dueDate - Date.now()
        
            const dayInMs = 1000 * 60 * 60 * 24
            const dayDiff = Math.floor(timeDifferenceInMiliseconds / dayInMs)
            
            return dayDiff
        }
    },
}

// requests and responses
routes.get('/', Job.controllers.index) // caminho GET para página inicial
routes.get('/job', (req, res) => res.render(views + "job")) // caminho GET para página job
routes.post('/job', Job.controllers.create) // envio de dados do formulário com POST para a página jobs
routes.get('/job/edit', (req, res) => res.render(views + "job-edit")) // caminho GET para página de editar os job
routes.get('/profile', (req, res) => res.render(views + "profile", {profile})) // caminho GET para página profile


module.exports = routes; // exportar as rotas