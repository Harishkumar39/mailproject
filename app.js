const express=require("express");
const bodyparse=require("body-parser");
// const { json } = require("body-parser");
const https=require("https")

const app=express();

app.use(bodyparse.urlencoded({extended:true}))
app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
    
})

app.post("/",function(req,res){
    var fname=req.body.fname;
    var lname=req.body.lname;
    var mail=req.body.mail;

    var data={
        members:[
            {
                email_address: mail,
                status: "subscribed",
                merge_fields:{
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    };
    const jsondata=JSON.stringify(data);
    const url="https://us21.api.mailchimp.com/3.0/lists/07392e1b14"
    const options={
        method: "POST",
        auth: "harish:d7526150cb053a7574f120a7dd70e3bf-us21"
    }
    const Request=https.request(url, options, function(response){
        if(response.statusCode==200){
            res.sendFile(__dirname+"/success.html")
        }
        else{
            res.sendFile(__dirname+"/failure.html")  
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })
    Request.write(jsondata)
    Request.end()

    console.log(fname +" "+ lname +" "+ mail)
})


app.post("/failure",function(req,res){
    res.redirect("/")
})

app.listen(process.env.PORT || 3000,function(){
    console.log("running at port 3000");
})

//API 9866cc27d81418b3491593d03940ae4-us21
//API key2 d7526150cb053a7574f120a7dd70e3bf-us21
//ID 07392e1b14