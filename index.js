const express = require("express");
var bodyParser =require("body-parser");


//Database
const database = require("./database");

//Initialise express
const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

/*
Route  /
Description Get all the books
Access Public
Parameter none
methods GET
*/

booky.get("/",(req, res) => {
   return res.json({books: database.books});

});

/*
Route  /is
Description Get specific book on ISBN 
Access Public
Parameter isbn
methods GET
*/

booky.get("/is/:isbn", (req, res) =>{
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );

    if(getSpecificBook.length === 0){
        return res.json({error: `NO book found for the ISBN of ${req.params.isbn}`});
    }

    return res.json({book: getSpecificBook});
});

/*
Route  /c
Description Get specific book on category
Access Public
Parameter category
methods GET
*/
booky.get("/c/:category", (req, res) => {
    const getSpecificBook= database.books.filter(
        (book) => book.category.includes(req.params.category)
    )

    if(getSpecificBook.length === 0){
        return res.json({error: `No book found for the category of ${req.params.category}`})
    }

    return res.json({book : getSpecificBook});
});

/*
Route  /author
Description Get all author
Access Public
Parameter none
methods GET
*/
booky.get("/author", (req, res) => {
    return res.json({authors : database.author});
});

/*
Route  /author/book
Description Get all authors based on books
Access Public
Parameter category
methods GET
*/
booky.get("/author/book/:isbn", (req, res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );

    if(getSpecificAuthor.length === 0){
        return res.json({error: `No book found for the book of ${req.params.isbn}`});
    }

    return res.json({authors: getSpecificAuthor});
});

/*
Route  /publications
Description Get all  publications
Access Public
Parameter none
methods GET
*/
booky.get("/publications", (req, res) => {
      return res.json({publications: database.publication});
});

/*
Route  /author/id/:id
Description Get all books based on languages
Access Public
Parameter id
methods GET
*/
booky.get("/author/id/:id", (req,res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.id === parseInt(req.params.id)
    );
    if(getSpecificAuthor.length === 0){
        return res.json({error: `No Books found for the Author ${req.params.id}`});
    }
    return res.json({author: getSpecificAuthor});
});

/* 
Route   /lan
Description  Get specific book Based on language
Access  Public
Parameter  ibsn
Methods  GET
*/
booky.get("/lan/:language", (req,res)=>{
    const getSpecificBook= database.books.filter(
        (book)=> book.language === req.params.language
    )
    if(getSpecificBook.length === 0){
        return res.json(`No such book found with language ${req.params.language}`)
    }
    return res.json({language: getSpecificBook})
});

/* 
Route    /pub/id
Description  Get specific publication Based on id
Access   Public
Parameter  id
Methods  GET
*/
booky.get("/pub/id/:id", (req, res)=>{
    const getSpecificPublication = database.publication.filter(
        (pub)=> pub.id === parseInt(req.params.id) 
    )
    if(getSpecificPublication.length===0){
        return res.json(`No such publication with id ${req.params.id} found`)
    }
    return res.json({Publication: getSpecificPublication})
});

/* 
Route    /pub/id
Description  Get specific publication Based on book
Access   Public
Parameter  id
Methods  GET
*/
booky.get("/pub/book/:isbn", (req,res)=>{
    const getSpecificPublication= database.publication.filter(
        (pub) => pub.books.includes(req.params.isbn)
    )
    if(getSpecificPublication.length === 0){
        return res.json(`No such book found with name ${req.params.isbn}`)
    }
    return res.json({Publication: getSpecificPublication})
});

//POST

/* 
Route    /book/new
Description  Add new books
Access   Public
Parameter  none
Methods  POST
*/
booky.post("/book/new",(req,res) => {
    const newBook = req.body;
    database.books.push(newBook);
    return res.json({UpdatedBooks: database.books});
});

/* 
Route    /author/new
Description  Add new author
Access   Public
Parameter  none
Methods  POST
*/
booky.post("/author/new",(req,res) => {
    const newAuthor = req.body;
    database.author.push(newAuthor);
    return res.json({UpdatedAuthor: database.author});
});

/* 
Route    /publications/new
Description  Add new publication
Access   Public
Parameter  none
Methods  POST
*/
booky.post("/publication/new",(req,res) => {
    const newPublication = req.body;
    database.publication.push(newPublication);
    return res.json({UpdatedPublication: database.publication});
});



//PUT METHOD

/* 
Route    /publications/update/book
Description  Update/Add new publication
Access   Public
Parameter  isbn
Methods  PUT
*/
booky.put("/publication/update/book/:isbn",(req,res) => {
   //update the publication database
   database.publication.forEach((pub) => {
   if(pub.id === req.body.pubId){
       return pub.books.push(req.params.isbn);
    }  
});
 //update the book database
   database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn){
        book.publications = req.body.pubId;
        return;
    }   
   });

   return res.json(
       {
           books: database.books,
           publiactions: database.publication,
           message: "Successfully updated publication"
       }
   );
}); 

//DELETE METHOD

/* 
Route    /book/delete
Description  Delete a book
Access   Public
Parameter  isbn
Methods  DELETE
*/
booky.delete("/book/delete/:isbn", (req,res) => {
   //Whichever book that doesnot match with the isbn,
   //just send it to database array and rest will be filter out

   const updatedBookDatabase = database.books.filter((book) => book.ISBN !== req.params.isbn)
   database.books = updatedBookDatabase;

   return res.json({books: database.books});
});

/* 
Route    /book/delete/author
Description  Delete an author from a book and vice versa
Access   Public
Parameter  isbn, authorId
Methods  DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
   //Update the book database
   database.books.forEach((book) => {
       if(book.ISBN === req.params.isbn){
           const newAuthorList = book.author.filter(
               (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
           );
           book.author = newAuthorList;
           return;
       }
   });
    
   //Update the author database
   database.author.forEach((eachAuthor) => {
       if(eachAuthor.id === parseInt(req.params.authorId)){
           const newBookList = eachAuthor.books.filter(
               (book) => book !== req.params.isbn);

               eachAuthor.books = newBookList;
               return;
           
       }
   });

     return res.json({
         book: database.books,
         author: database.author,
         message: "Author was deleted!!!"
     });
});

    

booky.listen(3000, () =>{
    console.log("server on port 3000 is up and running");

});

