import mysql from "mysql2/promise"

export  const pool = mysql.createPool({
    host:'mysql.railway.internal',
    password:'wbYCBMWhMnnaigAbnORiNuFpultabNeM',
    user:'root',
    database:'railway',
    port:3306
})

export  const DbPool = mysql.createPool({
    host:'mysql.railway.internal',
    password:'wbYCBMWhMnnaigAbnORiNuFpultabNeM',
    user:'root',
    database:'railway',
    port:3306
})
