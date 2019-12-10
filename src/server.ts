import express from 'express';
import { Router,Request,Response } from "express"
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

//init url-validator checker
var urlExists = require('url-exists');

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
  app.get("/filteredimage",(req:Request, res: Response) => 
    {
      //res.status(200).send("endpoint working");
      let name = req.query;
      //Check if the url is empty
      if (!name.image_url){
        return res.status(400).
                              send("url is requried");
      }
      
      //check if url is valid
      urlExists(name.image_url, function(err:Error, exists:boolean) 
        {
          //variable for tracking procesed image path
          var imagePath = '';
          if (exists){
            //filter image for a given public url
            let imgfilterPromise =  filterImageFromURL(name.image_url);
            imgfilterPromise.then(function (imgPath)
              {
              
                return new Promise(resolve =>{
                  //assign image path in global var
                  imagePath = imgPath;
                  //send file as response and delete local created file after file is sent
                  res.status(200).sendFile(imgPath,()=>{
                    let imagePathArray: string[] = [];
                    //console.log(imagePath);
                    imagePathArray.push(imagePath);
                    
                    let del = deleteLocalFiles(imagePathArray);});
                });
              
              });
          }
          else 
            {
              res.status(422).send("invalid url");
            }
        });
      
      
    }
  );
  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();