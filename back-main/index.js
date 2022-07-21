 const express=require('express');
 const mysql=require('mysql');
 var cors = require('cors');
 const app= express();
 const bodyParser = require('body-parser');
const { response } = require('express');
 app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())
app.use(cors())
const port=8080;
 app.listen(port,()=>{
      console.log('server started on port ',port);
 });

 //create connection
 const db=mysql.createConnection({
     host :'localhost',
     user :'root',
     password:'raj8987snehil#@',
     database:'nodemysql'
 });

 //connect
 db.connect((err)=>{
     if(err)
     console.log("error message ",err)
     
     console.log('mysql connected....');
 })

 //create db
 app.get('/createdb',(req,res)=>{
     let sql='CREATE DATABASE nodemysql';
     db.query(sql,(err,result)=>{
         if(err)
           console.log("error message ",err);
        res.send('database created');
     })
 })

 //create emp table
 app.get('/createposttable',(req,res)=>{
    let sql='CREATE TABLE emp(id int auto_increment,title varchar(255),body varchar(255) ,primary key (id))';
    db.query(sql,(err,result)=>{
        if(err)
          console.log("error message ",err);
    //    console.log(result);
       res.send('table created...');
    })
})

 //create contact table
 app.get('/createposttable1',(req,res)=>{
    let sql1='create table contact (firstname varchar(255),lastname varchar(255),mobileno bigint  NOT NULL UNIQUE ,email varchar(255),feedback varchar(255),primary key(email));';
    db.query(sql1,(err,result)=>{
        if(err)
          console.log("error message ",err)
       res.send('table created   contact...');
    })
})

//push data in order table
app.post('/contactpost',(req,res)=>{
    // res.send(req.body)
    const obj={
        firstname:req.body.firstName,
        lastname:req.body.lastName,
        mobileno:req.body.mobNo,
        email:req.body.email,
        feedback:req.body.feedBack
    }
    // console.log(obj);
    let sql='insert into contact SET ?';                         //42242536534647657587686
    // console.log(sql);
     db.query(sql,obj,(err,result)=>{
        if(err){
          res.status(409).send({
            message:"DATA NOT UPDATED",
          })
        }
        else{
            res.status(200).send({
                message:"DATA INSERTED",     
            })

        }
    })  
})

// get emp details
app.get('/getemp',(req,res)=>{
   let sql='select * from emp';
   db.query(sql,(err,result)=>{
   if(err){
       res.status(404).send({
           message:"TABLE DOESN'T EXIST",
           sqlMessage:err.sqlMessage,
           errorcode:err.errno                           //work completed
       })
     }
   else{
    //    console.log("315",result)
       res.status(200).send({
           message:"DATA FETCHED",
           data: result
       })
   }
   })
})

// no of emp in table
app.get('/getnoemp',(req,res)=>{
   let sql='SELECT COUNT(*)as no FROM emp' ;
   db.query(sql,(err,result)=>{
       // console.log("error message ",err);  
       // const resp=(result&&result.length>0)?result[0].no:""
       // console.log(resp)
       // res.send(result)
       if(err){
           res.status(404).send({
               message:"TABLE DOESN'T EXIST",
               sqlMessage:err.sqlMessage,
               errorcode:err.errno                           //work completed
           })
         }
       else{
           res.status(200).send({
               
               message:"DATA FETCHED",
               data:result
           })
       }
   })
})

// get individual details
app.get('/getemp/:id',(req,res)=>{
   let sql=`select * from emp where id =${req.params.id}`;
   db.query(sql,(err,result)=>{
       if(err){
           res.status(404).send({
               message:"TABLE DOESN'T EXIST",
               sqlMessage:err.sqlMessage,
               errorcode:err.errno                           //work completed
           })
         }
       else if(result.length===0){
        res.status(404).send({
            message:"DATA NOT FOUND",
            data:result                         //work completed
        })
       }
       else{
           console.log(result)
           res.status(200).send({
               message:"DATA FETCHED",
               data:result
           })
       }
   })
})

//delete emp
app.delete('/deleteemp/:id',(req,res)=>{
   let sql=`delete from emp where id=${req.params.id}`;
    db.query(sql,(err,result)=>{
       if(err){
           res.status(404).send({
               message:"TABLE DOESN'T EXIST",
               sqlMessage:err.sqlMessage,
               errorcode:err.errno                           //work completed
           })
         }
       else if(result.affectedRows===0){
           res.status(404).send({
               message:"DATA NOT FOUND",
               data:result
           })
       }
       else{
           res.status(200).send({
               message:"DATA DELETED",
               data:result
           })
       }
   //    console.log(result.affectedRows);
   //    res.send(err);
   })
})

//post
app.post('/apppost',(req,res)=>{
   const obj={
       id:req.body.id,
       title:req.body.title,
       body:req.body.body
   }
   console.log("202",obj);
   let sql='insert into emp SET ?';
   // console.log(sql);
    db.query(sql,obj,(err,result)=>{
        console.log("208" ,err)
        if(err){
               if(err.code==='ER_NO_SUCH_TABLE'){
                  res.status(404).send({
                  message:"TABLE DOESN'T EXIST",
                  sqlMessage:err.sqlMessage,
                  errorcode:err.errno                           //work completed
               })
          }
        else if(err.code==='ER_DUP_ENTRY'){
          
            res.status(409).send({
                message:"DUPLICATE ENTRY",
            })
        }
       }
        else{
            console.log("222" ,result)
            res.status(200).send({
                message:"DATA INSERTED ",     
            })
        }
   })  
})

app.put('/putemp',(req,res)=>{
   let sql=`update emp set title='${req.body.title}',body='${req.body.body}' where id=${req.body.id}`
   db.query(sql,(err,result)=>{
       console.log("err ",err," result ",result)
        res.status(200).send({
            message:"DATA UPDATED",
            data:result
        })
    
   })  
})


