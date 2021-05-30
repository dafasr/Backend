const mysql = require('mysql')
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
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
app.listen(2205)