const express = require("express"); // importa o node express
const routes = express.Router() // cria as rotas

const views = __dirname + "/views/"

const Profile = // objeto profile
{
    data: { // atributos do objeto
        name: "Gui", // nome do perfil
        avatar: "https://avatars.githubusercontent.com/u/62032974?v=4", // foto de perfil
        "monthly-budget": 3000, // orçamento mensal
        "days-per-week": 5, // dias de trabalho por semana
        "hours-per-dary": 5, // horas de trabalho por dia
        "vacation-per-year": 4, // semanas de férias por ano
        "value-hour": 60 // valor/hora
    },

    controllers: { // camada de controle do objeto
        index(req, res){ // mostra o caminho da página profile
            return res.render(views + "profile", {profile: Profile.data})
        },

        update(req, res) { // atualizando o profile
            // req.body para pegar os dados
            const data = req.body

            // definir quantas semanas tem um ano
            const weeksPerYear = 52

            // remover as semanas de férias do ano, para pegar quantas semanas tem em 1 mês
            const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12

            // total de horas trabalhadas na semana
            const weekTotalHours = data["hours-per-day"] * data["days-per-week"]

            // horas trabalhadas no mês
            const monthlyTotalHours = weekTotalHours * weeksPerMonth

            // qual será o valor da minha hora?
            const valueHour = data["monthly-budget"] / monthlyTotalHours

            Profile.data = {
                ...Profile.data,
                ...req.body,
                "value-hour": valueHour
            }

            return res.redirect("/profile")
        }
    }
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

    controllers: // camada de controladores do objeto
    {
        index(req, res) { // atualiza a lista de jobs
            const updatedJobs = Job.data.map((job) => { 
                const remaining = Job.services.getRemainingDays(job) // calcula quantos dias falta
                const status = remaining <= 0 ? "done" : "progress" // condicional pra descobrir o status do job (Encerrado/Em andamento)
            
                return {
                    ...job, // pra não digitar todos dados do objeto de novo
                    remaining, 
                    status,
                    budget: Job.services.calculateBudget(job, Profile.data["value-hour"]) // preço do job
                }
            })
            
            return res.render(views + "index", {jobs : updatedJobs}) // retorna o objeto job atualizado
        },

        create(req, res) { // cria o job
            return res.render(views + "job") 
        },

        save(req, res) { // função para criar o job
            const lastId = Job.data[Job.data.length - 1]?.id || 0; // calcula o id
        
            Job.data.push({ // coloca o objeto dentro da lista
                id: lastId + 1,
                name: req.body.name,
                "daily-hours": req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                created_at: Date.now()
            })

            return res.redirect('/') // após criar o job retorna pra página inicial
        },

        show(req, res) { // mostrar o job
            const jobId = req.params.id // id do job

            const job = Job.data.find(job => Number(job.id) === Number(jobId)) // verifica se o mesmo existe

            if(!job) {
                return res.send("Job não encontrado")
            }

            job.budget = Job.services.calculateBudget(job, Profile.data["value-hour"]) // calcula o valor/hora

            return res.render(views + "job-edit", {job})
        },

        update(req, res) { // atualizar o job
            const jobId = req.params.id // id do job

            const job = Job.data.find(job => Number(job.id) === Number(jobId)) // verifica se o mesmo existe

            if(!job) {
                return res.send("Job não encontrado")
            }

            const updatedJob = { // dados que vão atualizar
                ...job,
                name: req.body.name,
                "total-hours": req.body["total-hours"],
                "daily-hours": req.body["daily-hours"],
            }

            Job.data = Job.data.map(job => { // função que atualiza o objeto

                if(Number(job.id) === Number(jobId)) {
                    job = updatedJob
                }
                return job
            }) 

            res.redirect("/job/" + jobId) // volta pra mesma página
        },

        delete(req, res) { // deleta o job
            const jobId = req.params.id // id do job

            Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId)) // filtra e deleta o job

            return res.redirect("/")
        },
    },

    services: // camada de auxilio dos controllers
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
        },

        calculateBudget: (job, valueHour) => valueHour * job["total-hours"] // função que calcula o orçamento
    },
}

// requests and responses
routes.get('/', Job.controllers.index) // caminho GET para página inicial

routes.get('/job', Job.controllers.create) // caminho GET para página job
routes.post('/job', Job.controllers.save) // envio de dados do formulário com POST para a página jobs

routes.get('/job/:id', Job.controllers.show) // caminho GET para página de editar os job
routes.post('/job/:id', Job.controllers.update) // caminho POST editar o formulário do job
routes.post('/job/delete/:id', Job.controllers.delete) // caminho para deletar o job

routes.get('/profile', Profile.controllers.index) // caminho GET para página profile
routes.post('/profile', Profile.controllers.update)


module.exports = routes; // exportar as rotas