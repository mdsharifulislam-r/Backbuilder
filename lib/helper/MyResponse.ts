import { Number } from "mongoose";
import { NextResponse } from "next/server";

export const MyResponse = (body:any,status?:number)=>new Response(body,{
    status:status,
    headers: {
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
})
