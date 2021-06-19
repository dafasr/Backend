const sql = require('mysql')
const { rows } = require("mssql");
const con = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tugas1'
})

module.exports = function(req, res, next) {
    const username = req.headers.username
    const password = req.headers.password

    con.query('SELECT username FROM user WHERE username=? AND password=?', [username, password], function(err, data1){
        if(data1.length > 0 ) {
            next()
        } else {
            res.send(401)
        }
    })
}