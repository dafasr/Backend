const mysql = require('mysql')
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { rows } = require('mssql');
const app = express();
const authentication = require('./middleware/authentication.js')
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: "tugas1" 
})
con.connect(function(err){
    if(err) console.log(err);
    else console.log("Connected!")
})
app.get('/', (req, res) => {
    res.send(`<html><div><form method="post" action="/todo"><input type="text" name="kode"/><button type="submit">Add</button></form></div></html>`);

});
app.post('/todo', (req, res) => {
    var data = req.body.Hal
    var db = "INSERT INTO todolist (Hal) VALUES ('"+data+"')"
    con.query(db, data, function(err, data1){
        if(err) throw err;
        console.log("User Data has inserted!")
    })
    res.end()
})
app.get('/todo', (req, res) => {
    con.query("SELECT * FROM todolist", (err, rows, field) =>{
        if(!err){
            res.send(rows)
        }
        else{
            console.log(err)
        }
    })
})
app.delete('/todo/:Id', (req, res) => {
    con.query("DELETE from todolist WHERE Hal='"+req.params.Id+"'")
    res.end()
})
app.get('/user',authentication ,(req, res) => {
    con.query("SELECT id, username FROM user", (err, rows, field) => {
        if(!err){
            res.send(rows)
        }
        else{
            console.log(err)
        }
    })
})
app.post('/user', (req, res, next) => {
    con.query('SELECT COUNT(*) as total FROM user', function(err, data1) {
        var convert = Object.values(data1)
        if(convert[0].total > 0){
            auth(req,res,next)
        } else {
            next()
        }
    })
}, (req, res) => {
    const username = req.body.username
    const password = req.body.password
    con.query('SELECT username FROM user WHERE username=?',[username], function(err, rows, field) {
        if(rows.length > 1){
            res.send(401)
        } else {
            con.query('INSERT INTO user (username, password) VALUES (?,?)',[username,password], function(err, data1){
                if(err) {
                    res.end(500)
                    return
                }
            })
            con.query('SELECT id, username FROM user ORDER BY id DESC LIMIT 1', (err, rows, field) => {
                res.send(rows)
            })
        }
    })
})
app.delete('/user/:Id', (req, res) => {
    con.query('SELECT COUNT(*) as total FROM user', function(err, data1) {
        var convert = Object.values(data1)
        if(convert[0].total > 1){
            con.query("DELETE from user WHERE id='"+req.params.Id+"'")
            res.end("Deleted")
        }else {
            res.send(401)
        }
    })
})
app.listen(2205)
