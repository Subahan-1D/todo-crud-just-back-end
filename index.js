const express = require('express')
const app = express()
const port = 9000 ;



app.get('/' , (req,res)=>{
    console.log("Hello Back-end Developer")
})

app.listen(port , () =>{
    console.log(`Server is running on ${port}`)
})