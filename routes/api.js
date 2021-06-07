/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require ('mongoose');

mongoose.connect(process.env.DB,{useNewUrlParser:true,useUnifiedTechnology:true});

const BookComment= new mongoose.Schema(
  {
  title:String,
  comments:Array,
  commentcount:Number
  },
    { toObject: { versionKey: false }                                     
})


const BookCommentCollection = new mongoose.model("BookCommentCollection", BookComment);



module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
    
   BookCommentCollection.find({},{title:1, commentcount:1,_id:1})  // find ... and return only specified fields
                          .then(result=>{
      res.json(result);
    })
    .catch("Error occured, please try again");
    
    
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
    
    if((req.body.title=="") || (req.body.title===undefined)){
     return res.send("missing required field title");
    }  
    
    
     let title = req.body.title;
    
     let DataToDB = new BookCommentCollection({title:title,comments:[], commentcount:0})
   

    BookCommentCollection.find({title:title})
                          .then(result=>{
                            if(Object.keys(result).length>0){// start if
                              return res.send("This book title already exists");
                            } // end of if
      
                            else{ // else
                              
                                                           
                               DataToDB.save()
                                        .then(savedDoc=>{
                                           return   res.json({title:savedDoc["title"],_id:savedDoc["_id"]})
                                         })
                                         .catch(err=>{
                                            return res.send("unable to save title");
                                       })// end of save dataToDB
                            }// end of else
                          })
                          .catch(err=>{
                        return    res.send("Unable to complete save");
    })
 
 
 
    })
    
    .delete(function(req, res){
    
    BookCommentCollection.remove(function(err,deletedcount){
      if(err){
        res.send("Error occured");
      }
      console.log("complete delete successful")
        res.send("complete delete successful");
    })
                        /*  .then(deletedcount=>{
           res.send("Complete delete successful");
         })
         .catch(err=>{
        res.send("Error occured");
      })
    */
            
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
    
    BookCommentCollection.find({_id:bookid},{commentcount:0})
                        .then(result=>{
                               if(result.length>0){
                                     return res.json(result[0]);
                               }
                               else{
                                   return res.send("no book exists");
                               }
                          })
                          .catch(err=>{
                                  res.send("no book exists");
                           })
    
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
    
    
    
  let text = ((req.body.comment=="") || (req.body.comment===undefined)) ?   res.send("missing required field comment") : req.body.comment;
    
   
    
    BookCommentCollection.findByIdAndUpdate({_id:bookid},{$push:{comments:text}, $inc:{commentcount:1}},{new:true} )
                          .then(updatedDoc=>{
                               
      if(Object.keys(updatedDoc).length>0){
          
                                   return res.json({title:updatedDoc["title"],_id:updatedDoc["_id"],comments:updatedDoc["comments"]})
      }
      else{
           res.send("no book exists")
      }
                          
          
     
    })
    .catch(err=>{
      return res.send("no book exists");
    })
    
    
    
    
    
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
    
    BookCommentCollection.findByIdAndRemove({_id:bookid})
                        .then(deletedItem=>{
      if(Object.keys(deletedItem).length>0){
        res.send("delete successful")
      }
      else{
        res.send("no book exists")
      }
    })
    .catch(err=>{
      res.send("no book exists");
    })
      //if successful response will be 'delete successful'
    });
  
};
