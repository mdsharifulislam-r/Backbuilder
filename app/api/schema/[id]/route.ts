import { endpoint } from "@/components/singleEndPoint/Table/TableRow"
import { pool } from "@/lib/DB/pool"
import { NextResponse } from "next/server"

export async function  GET(Request:Request,{params}:{params:{id:string}}) {
    try {
        const {id}= params
       
        const [rows]:any= await pool.execute('SELECT * FROM `scheme` WHERE primary_id=?',[id])
        if(!rows){
            return NextResponse.json({
                success:false,
                message:'Data not found'
            },{
                status:404
            })
            
        }
        
      return  NextResponse.json({
            success:true,
            message:"Data get succcessfully",
            data:rows
        })
    } catch (error) {
        return NextResponse.json({
            success:false,
            message:'Something went wrong'
        },{
            status:500
        })
    }
}

export async function DELETE(Request:Request,{params}:{params:{id:string}}) {
    try {
        const {id}= params
        const {project_id,schma_name,endpoint_name}:{project_id:number,schma_name:string,endpoint_name:string} = await Request.json()
        const [datas]= await pool.execute(`ALTER TABLE ${endpoint_name+project_id} DROP COLUMN ${schma_name}`)
        const [rows] = await pool.execute('DELETE FROM `scheme` WHERE schema_id=?',[id])
        return NextResponse.json({
            success:true,
            message:"Schema deleted successfully"
        })
        
    } catch (error) {
        return NextResponse.json({
            success:false,
            message:'Something went wrong'
        },{
            status:500
        })
    }
}

export async function POST(Request:Request) {
    try {
        const {name,type,required,primary_id,project_id}:endpoint&{project_id:number} = await Request.json()
     
        if(!(name&&type&&primary_id)){
            return NextResponse.json({
                success:false,
                message:'Invalid credintials'
            },{
                status:400
            })
        }
        const [rowss]:any= await pool.execute('SELECT * FROM `scheme` WHERE primary_id=? AND name=?',[primary_id,name])
        if(rowss?.length){
            return NextResponse.json({
                success:false,
                message:"Schmea Already Exist"
            })
        }
        const sql = 'INSERT INTO `scheme`( `primary_id`, `name`, `type`, `required`) VALUES (?,?,?,?)'
        const values = [primary_id,name,type,required]
        const [rows]=await pool.execute(sql,values)
        const [data]:any = await pool.execute('SELECT * FROM endpoints WHERE primary_id=?',[primary_id])
        if(data[0]?.name){
            let temp=''
            
            if(type=='integer'){
                temp+='int '
            }else if(type=='string'){
                temp+='varchar(256) '
            }
            else if(type=='boolean'){
                temp+='boolean '
            }else if(type=='float'){
                temp+='float '
            }else{
                temp+='varchar(256) ' 
            }
            const sql = `ALTER TABLE ${data[0]?.name+project_id} ADD COLUMN ${name} ${temp} `
          
            
            const [rowsss] = await pool.execute(sql)
        }
        return NextResponse.json({
            success:true,
            message:"Schema add successfully"
        })
        
    } catch (error) {
        console.log(error);
        
        return NextResponse.json({
            success:false,
            message:'Something went wrong',
            error:error
        },{
            status:500
        })
    }
}