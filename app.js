var express =     require("express"),
    app     =     express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    methodOverride = require("method-override"),
    flash          = require("connect-flash"),
    User           = require("./models/user.js"),
    Electricity    = require("./models/electricity.js"),
    Carpentry     =  require("./models/carpentry.js"),
    Plumbing     =  require("./models/plumbing.js"),
    Mess        =   require("./models/mess.js"),
    Housekeeping  =  require("./models/housekeeping.js"),
    Security      =   require("./models/security.js"),
    Others       =    require("./models/others.js"),
    Internet     =    require("./models/internet.js"),
    Comment      =    require("./models/comment.js"),
     passport       =  require("passport"),
    LocalStrategy  =                require("passport-local"),
    passportLocalMongoose =                require("passport-local-mongoose");
    
    
    
     app.locals.moment = require('moment');
    
 mongoose.connect("mongodb://localhost/hostel_db_1");
 app.use(bodyParser.urlencoded({ extended:true }));//line mandatory for using body parser and using post request
    
    
    mongoose.set('useCreateIndex', true)
//mongoose.connect(config.dbUri, { useNewUrlParser: true })
app.set("view engine","ejs");


app.use(express.static(__dirname+"/public"));

 app.use(methodOverride("_method"));//"_method"-default syntax we have to write always
 app.use(flash());



//PASSPORT CONFIGURATION
app.use(require("express-session")({//firstly secret(this line) should be written before writing app.use(passport.session())
    secret:"once again rusty wins cutest dog",
    resave:false,
    saveuninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
 passport.use(new LocalStrategy(User.authenticate()));
//passport.use(User.createStrategy());-->from stack overflow
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){//we are passimg a middleware here so that we can apply show and hide logic of signup and login button of navbar 
    res.locals.currentUser= req.user;//res.locals is a inbuilt method of passport which will allow use to use req.user object(here) as a middleware,here we are passing current user to every single template
     res.locals.error    = req.flash("error");//res.locals will allow us to use res.locals.message method in all other templates(ejs) 
     res.locals.success    = req.flash("success");
    next();
})






//  app.locals.moment = require('moment');
//HOME PAGE
app.get("/",function(req,res){
    res.render("landing");
})



//SHOW COMPLAINT TYPES   
app.get("/complaints",isLoggedIn,function(req,res){
    
    res.render("complaints");
})   



//SHOW ELECTRICITY COMPLAINT FORM   
app.get("/complaints/electricity",isLoggedIn,function(req, res) {
    res.render("electricity");
})


//POST ELECTRICITY COMPLAINT
app.post("/complaints/electricity",isLoggedIn,function(req,res){
    
    var first_name    = req.body.first_name;
    var last_name     = req.body.last_name;
    var branch        = req.body.branch;
    var semester      = req.body.semester;
    var phone_no      = req.body.phone_no;
    var usn           = req.body.usn;
    var block_room_no = req.body.block_room_no;
    var email         = req.body.email;
    var subject       = req.body.subject;
    var description   = req.body.description;
    
    var author = {
        id:req.user._id,
        username:req.user.username
    }
    
    var newElectricityComplaint = {
                                      first_name:first_name,last_name:last_name,branch:branch,
                                      semester:semester,phone_no:phone_no,
                                      usn:usn,block_room_no:block_room_no,email:email,
                                      subject:subject,description:description,author:author
        
    };
    
    Electricity.create(newElectricityComplaint,function(err,newlyCreated){
        
        if(err){
            console.log(err);
        }
        else{
            
            res.redirect("/complaints");
        }
        
        
    });
    
    
    
})


//VIEW ALL ELECTRICITY COMPLAINT
app.get("/elecomplaints",function(req, res) {
    
    Electricity.find({},function(err,elecomplaints){
        if(err){
            console.log(err);
        }
        else{
            res.render("elecomplaints",{elecomplaints:elecomplaints});
        }
    });
    
    
});


//SHOW DETAILED ELECTRICITY COMPLAINT OF A PARTICULAR STUDENT

app.get("/elecomplaints/:id",function(req, res) {
    //find complaint by the id
    
    Electricity.findById(req.params.id).populate("comments").exec(function(err,foundelecomplaint){
        if(err){
            console.log(err)
        }
        else{
            //console.log(foundelecomplaint)
             res.render("foundelecomplaint",{found:foundelecomplaint});
        }
    })
   
})



app.get("/elecomplaints/:id/comments",function(req, res) {
    // res.send("this will be comment form");
    //found electricitycomplaints by id 
    Electricity.findById(req.params.id,function(err,foundelecomplaint){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/foundelecomplaint",{found:foundelecomplaint});
        }
    })
    
});


//COMMENTS CREATE
app.post("/elecomplaints/:id/comments",checkComplaintOwnership,function(req,res){
   //lookup complaint using id
   Electricity.findById(req.params.id,function(err, foundelecomplaint) {
      if(err){
          console.log(err);
          res.redirect("/complaints");
      } 
      else{
          Comment.create(req.body.comment,function(err,comment){
              if(err){
                 
                  //req.flash("error","Something went wrong");
                  console.log(err);
              }
              else{
                  //in this v8 we will add username and id to comment before pushing it in the db
                   //console.log(req.body.comment);
                  comment.author.id=req.user._id;
                  comment.author.username=req.user.username;
                 
                  //save the comment
                  comment.save();
                  foundelecomplaint.comments.push(comment);
                  foundelecomplaint.save();
                  //req.flash("Successfully added comment");
                  res.redirect("/elecomplaints/"+foundelecomplaint._id);
              }
          })
      }
   });
   //create new comment
   //connect new comment to campground
   //redirect to campground show page
});



    
    
    
//});





//SHOW PLUMBING COMPLAINT FORM
app.get("/complaints/plumbing",isLoggedIn,function(req, res) {
    res.render("plumbing");
})



//POST PLUMBING COMPLAINT
app.post("/complaints/plumbing",isLoggedIn,function(req,res){
    
    var first_name    = req.body.first_name;
    var last_name     = req.body.last_name;
    var branch        = req.body.branch;
    var semester      = req.body.semester;
    var phone_no      = req.body.phone_no;
    var usn           = req.body.usn;
    var block_room_no = req.body.block_room_no;
    var email         = req.body.email;
    var subject       = req.body.subject;
    var description   = req.body.description;
    
    var newPlumbingComplaint = {
                                      first_name:first_name,last_name:last_name,branch:branch,
                                      semester:semester,phone_no:phone_no,
                                      usn:usn,block_room_no:block_room_no,email:email,
                                      subject:subject,description:description
        
    };
    
    Plumbing.create(newPlumbingComplaint,function(err,newlyCreated){
        
        if(err){
            console.log(err);
        }
        else{
            console.log(newlyCreated);
            res.redirect("/complaints");
        }
        
        
    });
    
    
    
})


//VIEW ALL PLUMBING COMPLAINT
app.get("/plumcomplaints",isLoggedIn,function(req, res) {
    
    Plumbing.find({},function(err,plumcomplaints){
        if(err){
            console.log(err);
        }
        else{
            res.render("plumcomplaints",{plumcomplaints:plumcomplaints});
        }
    });
    
    
});



//SHOW DETAILED PLUMBING COMPLAINT OF A PARTICULAR STUDENT

app.get("/plumcomplaints/:id",function(req, res) {
    //find complaint by the id
    
    Plumbing.findById(req.params.id,function(err,foundplumcomplaint){
        if(err){
            console.log(err)
        }
        else{
             res.render("foundplumcomplaint",{found:foundplumcomplaint});
        }
    })
   
})




//SHOW CARPENTRY COMPLAINT FORM
app.get("/complaints/carpentry",isLoggedIn,function(req, res) {
    res.render("carpentry");
})


//POST CARPENTRY COMPLAINT
app.post("/complaints/carpentry",isLoggedIn,function(req,res){
    
    var first_name    = req.body.first_name;
    var last_name     = req.body.last_name;
    var branch        = req.body.branch;
    var semester      = req.body.semester;
    var phone_no      = req.body.phone_no;
    var usn           = req.body.usn;
    var block_room_no = req.body.block_room_no;
    var email         = req.body.email;
    var subject       = req.body.subject;
    var description   = req.body.description;
    
    var newCarpentryComplaint = {
                                      first_name:first_name,last_name:last_name,branch:branch,
                                      semester:semester,phone_no:phone_no,
                                      usn:usn,block_room_no:block_room_no,email:email,
                                      subject:subject,description:description
        
    };
    
    Carpentry.create(newCarpentryComplaint,function(err,newlyCreated){
        
        if(err){
            console.log(err);
        }
        else{
            console.log(newlyCreated);
            res.redirect("/complaints");
        }
        
        
    });
    
    
    
});


//VIEW ALL CARPENTRY COMPLAINT
app.get("/carpcomplaints",isLoggedIn,function(req, res) {
    
    Carpentry.find({},function(err,carpcomplaints){
        if(err){
            console.log(err);
        }
        else{
            res.render("carpcomplaints",{carpcomplaints:carpcomplaints});
        }
    });
    
    
});



//SHOW DETAILED CARPENTRY COMPLAINT OF A PARTICULAR STUDENT

app.get("/carpcomplaints/:id",function(req, res) {
    //find complaint by the id
    
    Carpentry.findById(req.params.id,function(err,foundcarpcomplaint){
        if(err){
            console.log(err)
        }
        else{
             res.render("foundcarpcomplaint",{found:foundcarpcomplaint});
        }
    })
   
})





//SHOW MESS COMPLAINT FORM
app.get("/complaints/mess",isLoggedIn,function(req, res) {
    res.render("mess");
})



//POST MESS COMPLAINT
app.post("/complaints/mess",isLoggedIn,function(req,res){
    
    var first_name    = req.body.first_name;
    var last_name     = req.body.last_name;
    var branch        = req.body.branch;
    var semester      = req.body.semester;
    var phone_no      = req.body.phone_no;
    var usn           = req.body.usn;
    var block_room_no = req.body.block_room_no;
    var email         = req.body.email;
    var subject       = req.body.subject;
    var description   = req.body.description;
    
    var newMessComplaint = {
                                      first_name:first_name,last_name:last_name,branch:branch,
                                      semester:semester,phone_no:phone_no,
                                      usn:usn,block_room_no:block_room_no,email:email,
                                      subject:subject,description:description
        
    };
    
    Mess.create(newMessComplaint,function(err,newlyCreated){
        
        if(err){
            console.log(err);
        }
        else{
            console.log(newlyCreated);
            res.redirect("/complaints");
        }
        
        
    });
    
    
    
})


//VIEW ALL MESS COMPLAINT
app.get("/messcomplaints",isLoggedIn,function(req, res) {
    
    Mess.find({},function(err,messcomplaints){
        if(err){
            console.log(err);
        }
        else{
            res.render("messcomplaints",{messcomplaints:messcomplaints});
        }
    });
    
    
});



//SHOW DETAILED MESS COMPLAINT OF A PARTICULAR STUDENT

app.get("/messcomplaints/:id",function(req, res) {
    //find complaint by the id
    
    Mess.findById(req.params.id,function(err,foundmesscomplaint){
        if(err){
            console.log(err)
        }
        else{
             res.render("foundmesscomplaint",{found:foundmesscomplaint});
        }
    })
   
})





//SHOW INTERNET COMPLAINT FORM
app.get("/complaints/internet",isLoggedIn,function(req, res) {
    res.render("internet");
})



//POST INTERNET COMPLAINT
app.post("/complaints/internet",isLoggedIn,function(req,res){
    
    var first_name    = req.body.first_name;
    var last_name     = req.body.last_name;
    var branch        = req.body.branch;
    var semester      = req.body.semester;
    var phone_no      = req.body.phone_no;
    var usn           = req.body.usn;
    var block_room_no = req.body.block_room_no;
    var email         = req.body.email;
    var subject       = req.body.subject;
    var description   = req.body.description;
    
    var newInternetComplaint = {
                                      first_name:first_name,last_name:last_name,branch:branch,
                                      semester:semester,phone_no:phone_no,
                                      usn:usn,block_room_no:block_room_no,email:email,
                                      subject:subject,description:description
        
    };
    
    Internet.create(newInternetComplaint,function(err,newlyCreated){
        
        if(err){
            console.log(err);
        }
        else{
            console.log(newlyCreated);
            res.redirect("/complaints");
        }
        
        
    });
    
    
    
})

//VIEW ALL INTERNET COMPLAINT
app.get("/intcomplaints",isLoggedIn,function(req, res) {
    
    Internet.find({},function(err,intcomplaints){
        if(err){
            console.log(err);
        }
        else{
            res.render("intcomplaints",{intcomplaints:intcomplaints});
        }
    });
    
    
});



//SHOW DETAILED INTERNET COMPLAINT OF A PARTICULAR STUDENT

app.get("/intcomplaints/:id",function(req, res) {
    //find complaint by the id
    
    Internet.findById(req.params.id,function(err,foundintcomplaint){
        if(err){
            console.log(err)
        }
        else{
             res.render("foundintcomplaint",{found:foundintcomplaint});
        }
    })
   
})


//SHOW HOUSEKEEPING COMPLAINT FORM
app.get("/complaints/housekeeping",isLoggedIn,function(req, res) {
    res.render("housekeeping");
})


//POST HOUSEKEEPING COMPLAINT
app.post("/complaints/housekeeping",isLoggedIn,function(req,res){
    
    var first_name    = req.body.first_name;
    var last_name     = req.body.last_name;
    var branch        = req.body.branch;
    var semester      = req.body.semester;
    var phone_no      = req.body.phone_no;
    var usn           = req.body.usn;
    var block_room_no = req.body.block_room_no;
    var email         = req.body.email;
    var subject       = req.body.subject;
    var description   = req.body.description;
    
    var newHousekeepingComplaint = {
                                      first_name:first_name,last_name:last_name,branch:branch,
                                      semester:semester,phone_no:phone_no,
                                      usn:usn,block_room_no:block_room_no,email:email,
                                      subject:subject,description:description
        
    };
    
    Housekeeping.create(newHousekeepingComplaint,function(err,newlyCreated){
        
        if(err){
            console.log(err);
        }
        else{
            console.log(newlyCreated);
            res.redirect("/complaints");
        }
        
        
    });
    
    
    
})

//VIEW ALL HOUSEKEEPING COMPLAINT
app.get("/hkcomplaints",isLoggedIn,function(req, res) {
    
    Housekeeping.find({},function(err,hkcomplaints){
        if(err){
            console.log(err);
        }
        else{
            res.render("hkcomplaints",{hkcomplaints:hkcomplaints});
        }
    });
    
    
});



//SHOW DETAILED HOUSEKEEPING COMPLAINT OF A PARTICULAR STUDENT

app.get("/hkcomplaints/:id",function(req, res) {
    //find complaint by the id
    
    Housekeeping.findById(req.params.id,function(err,foundhkcomplaint){
        if(err){
            console.log(err)
        }
        else{
             res.render("foundhkcomplaint",{found:foundhkcomplaint});
        }
    })
   
})


//SHOW SECURITY COMPLAINT FORM
app.get("/complaints/security",isLoggedIn,function(req, res) {
    res.render("security");
})


//POST SECURITY COMPLAINT
app.post("/complaints/security",isLoggedIn,function(req,res){
    
    var first_name    = req.body.first_name;
    var last_name     = req.body.last_name;
    var branch        = req.body.branch;
    var semester      = req.body.semester;
    var phone_no      = req.body.phone_no;
    var usn           = req.body.usn;
    var block_room_no = req.body.block_room_no;
    var email         = req.body.email;
    var subject       = req.body.subject;
    var description   = req.body.description;
    
    var newSecurityComplaint = {
                                      first_name:first_name,last_name:last_name,branch:branch,
                                      semester:semester,phone_no:phone_no,
                                      usn:usn,block_room_no:block_room_no,email:email,
                                      subject:subject,description:description
        
    };
    
    Security.create(newSecurityComplaint,function(err,newlyCreated){
        
        if(err){
            console.log(err);
        }
        else{
            console.log(newlyCreated);
            res.redirect("/complaints");
        }
        
        
    });
    
    
    
})

//VIEW ALL SECURITY COMPLAINT
app.get("/scycomplaints",isLoggedIn,function(req, res) {
    
    Security.find({},function(err,scycomplaints){
        if(err){
            console.log(err);
        }
        else{
            res.render("scycomplaints",{scycomplaints:scycomplaints});
        }
    });
    
    
});



//SHOW DETAILED SECURITY COMPLAINT OF A PARTICULAR STUDENT

app.get("/scycomplaints/:id",function(req, res) {
    //find complaint by the id
    
    Security.findById(req.params.id,function(err,foundscycomplaint){
        if(err){
            console.log(err)
        }
        else{
             res.render("foundscycomplaint",{found:foundscycomplaint});
        }
    })
   
})





//SHOW OTHERS COMPLAINT FORM
app.get("/complaints/others",isLoggedIn,function(req, res) {
    res.render("others");
})


//POST OTHERS COMPLAINT
app.post("/complaints/others",isLoggedIn,function(req,res){
    
    var first_name    = req.body.first_name;
    var last_name     = req.body.last_name;
    var branch        = req.body.branch;
    var semester      = req.body.semester;
    var phone_no      = req.body.phone_no;
    var usn           = req.body.usn;
    var block_room_no = req.body.block_room_no;
    var email         = req.body.email;
    var subject       = req.body.subject;
    var description   = req.body.description;
    
    var newOthersComplaint = {
                                      first_name:first_name,last_name:last_name,branch:branch,
                                      semester:semester,phone_no:phone_no,
                                      usn:usn,block_room_no:block_room_no,email:email,
                                      subject:subject,description:description
        
    };
    
    Others.create(newOthersComplaint,function(err,newlyCreated){
        
        if(err){
            console.log(err);
        }
        else{
            console.log(newlyCreated);
            res.redirect("/complaints");
        }
        
        
    });
    
    
    
})


//VIEW ALL OTHER COMPLAINT
app.get("/othcomplaints",isLoggedIn,function(req, res) {
    
    Others.find({},function(err,othcomplaints){
        if(err){
            console.log(err);
        }
        else{
            res.render("othcomplaints",{othcomplaints:othcomplaints});
        }
    });
    
    
});



//SHOW DETAILED OTHER COMPLAINT OF A PARTICULAR STUDENT

app.get("/othcomplaints/:id",function(req, res) {
    //find complaint by the id
    
    Others.findById(req.params.id,function(err,foundothcomplaint){
        if(err){
            console.log(err)
        }
        else{
             res.render("foundothcomplaint",{found:foundothcomplaint});
        }
    })
   
})





//REGISTER FORM   
app.get("/register",function(req, res) {
    res.render("register");
})   

//Handle sign Up logic
app.post("/register",function(req, res) {///always restart the server when you add the new route in
      
    var newUser =new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){//this "user"  will be newly created user
        if(err){
             console.log(err);
            // req.flash("error",err.message);//here err is built in error message from passport,and thus we dont have to type it in
             res.redirect("/register");
        }
        
        passport.authenticate("local")(req,res,function(){
            // req.flash("success","Welcome to YelpCamp" + " "+user.username);//we can also take username frm req.body.username,but here we are taking username which is dirctly coming from db
            // res.redirect("/campgrounds");
            res.redirect("/complaints");
        })
        
        
    });
});






//LOGIN FORM
app.get("/login",function(req, res) {
    res.render("login")//defining key value pair of message
});


app.post("/login",passport.authenticate("local",{
    
    successRedirect:"/complaints",
    failureRedirect:"/login"
}),function(req, res) {
    res.send("this is the login post route");
});

app.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged You out");
    res.redirect("/");
});

   




//MIDDLEWARE
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that");//this line doesnot display directly the error msg but gives us the capability to access error message before redirecting to /login
    res.redirect("/login");
        
    }





function checkComplaintOwnership(req,res,next){
    
    
    
    
    
    
    // function checkCampgroundOwnership(req,res,next){
    
    
    
    if(req.isAuthenticated()){//check if user is logged in
        Electricity.findById(req.params.id,function(err,foundelecomplaint){//if user is logged in find the campground by id and then pass it in the name of foundCampground
        if(err){
            req.flash("error","Electricity complaint not found");
            res.redirect("back");
        } else {
             //Does user own the campground?
            //  console.log(foundelecomplaint)
            //  console.log(foundelecomplaint.author)
            //  console.log(foundelecomplaint.author.id)
            //  console.log(req.user._id)
             if(foundelecomplaint.author.id.equals(req.user._id)){//if user is logged in check that whether author of the campground has same id as that of user that has logged in or not
                next();//in general we want to execute the code whatever is written after the middleware
                //  res.render("campgrounds/edit",{campground:foundCampground});//if user and author are same then render the edit form
             } else {
                 console.log(foundelecomplaint)
                 console.log(foundelecomplaint.author)
             console.log(req.user._id)
                 req.flash("error","You dont have permission to do that!!");
                 res.redirect("back");//  res.send("you dont have permission to do that");//if author of campground and user are different send the shown response
             }
         //foundCampground.author.id-> is a object wheras req.user._id is a string so we have to convert it to the string with the help of .equal method   
        }
        
         
      });
    
    } else {//if user is not logged in then
        
        req.flash("error","You need to be logged in to that");
        res.redirect("/login");
        //back will take the user to the previous page from which it came
        
           }
}
    




   
   
   app.listen(process.env.PORT,process.env.IP,function(){
   console.log("HOSTEL WEBSITE server has started!!")
});