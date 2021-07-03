const express = require("express"); // import express node module 
const routes = express.Router() // create the router

const views = __dirname + "/views/"

const profile = {
    name: "Gui",
    avatar: "https://avatars.githubusercontent.com/u/62032974?v=4",
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-dary": 5,
    "vacation-per-year": 4,
}

// requests and responses
routes.get('/', (req, res) => res.render(views + "index", {profile})) // path to index
routes.get('/job', (req, res) => res.render(views + "job")) // path to job page
routes.get('/job/edit', (req, res) => res.render(views + "job-edit")) // path to edit job
routes.get('/profile', (req, res) => res.render(views + "profile", {profile})) // path to profile


module.exports = routes;