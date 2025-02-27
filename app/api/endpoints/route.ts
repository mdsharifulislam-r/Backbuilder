import { pool } from "@/lib/DB/pool";
import { generateTableSyntex } from "@/lib/helper/generateTableSyntex";
import { NextResponse } from "next/server";

export async function POST(Request:Request) {
    try {
        const {name,project_id,schmea,is_user}:{name:string,project_id:number,schmea:{name:string,type:string,required:boolean}[],is_user:boolean}=await Request.json()
        if(!name || !project_id.toString()||!schmea.length){
            return NextResponse.json({
                success:false,
                message:"Please Fill All the required filed"
            })
        }
       await pool.execute('CREATE TABLE IF NOT EXISTS endpoints (primary_id int not null AUTO_INCREMENT PRIMARY KEY,name varchar(256),project_id int,is_user boolean)')
       await pool.execute('CREATE TABLE IF NOT EXISTS scheme (schema_id int not NULL AUTO_INCREMENT PRIMARY KEY,primary_id INT,name varchar(256),type varchar(256),required boolean)')
        const existpoint = 'SELECT name FROM `endpoints` WHERE project_id=? AND name=?'
        const [datas]:any=await pool.execute(existpoint,[project_id,name])
        if(datas.length){
            return NextResponse.json({
                success:false,
                message:"Endpoint already exists"
            })
        }
        
       
        const makeEndPoint = 'INSERT INTO `endpoints`( `name`, `project_id`,`is_user`) VALUES (?,?,?)'
        const [rows]=await pool.execute(makeEndPoint,[name,project_id,is_user])
        const getendpointId = 'SELECT MAX(primary_id) AS id FROM `endpoints` '
        const [ids]:any=await pool.execute(getendpointId)
        
        const endpoint_id = ids[0]?.id
        schmea.forEach(async item=>{
            const sql = 'INSERT INTO `scheme`( `primary_id`, `name`, `type`, `required`) VALUES (?,?,?,?)'
            const values = [endpoint_id,item.name,item.type,item.required]
            const [rows]= await pool.execute(sql,values)
        })
        const tableName = name+project_id.toString()
        const user_db_sql = await generateTableSyntex(schmea,tableName)
        const [rowsd] = await pool.execute(user_db_sql!) 
        return NextResponse.json({
            success:true,
            message:"Endpoint Create Successfully"
        })
    } catch (error) {
        return NextResponse.json({
            success:false,
            message:"Something went wrong"
        })
    }
}

