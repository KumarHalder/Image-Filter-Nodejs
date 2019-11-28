import express from 'express';
import { Router,Request,Response } from "express"
var fs = require('fs');
import bodyParser from 'body-parser';
import $ from "jquery";
import {filterImageFromURL, deleteLocalFiles} from './util/util';
const path = require('path');
var tempImageFolder = path.join(__dirname,"../src/util/tmp");
console.log(tempImageFolder);
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
  app.get("/filteredimage/",(req:Request, res: Response) => 
  {
    //res.status(200).send("endpoint working");
    let {name} = req.query;
    if (!name){
      return res.status(400).
                            send("url is requried");
    }

    let img =  filterImageFromURL(name);
    let imagePathArray: string[] = [];
    fs.readdir(tempImageFolder, function(err:Error, items:string) {
      //console.log(path.items);
   
      for (var i=0; i<items.length; i++) {
          
          imagePathArray.push(__dirname + "/util/tmp/" +  items[i])
      }
      console.log(imagePathArray);
      let del = deleteLocalFiles(imagePathArray);

  });
    return res.status(202).sendFile(img);
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