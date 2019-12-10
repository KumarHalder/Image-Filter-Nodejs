"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
var urlExists = require('url-exists');
const util_1 = require("./util/util");
var fs = require('fs');
const path = require('path');
var tempImageFolder = path.join(__dirname, "../src/util/tmp");
console.log(tempImageFolder);
(() => __awaiter(this, void 0, void 0, function* () {
    // Init the Express application
    const app = express_1.default();
    // Set the network port
    const port = process.env.PORT || 8082;
    // Use the body parser middleware for post requests
    app.use(body_parser_1.default.json());
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
    app.get("/filteredimage/", (req, res) => {
        //res.status(200).send("endpoint working");
        let name = req.query;
        console.log(name.image_url);
        if (!name.image_url) {
            return res.status(400).
                send("url is requried");
        }
        urlExists(name.image_url, function (err, exists) {
            var imagePath = '';
            if (exists) {
                let imgfilterPromise = util_1.filterImageFromURL(name.image_url);
                imgfilterPromise.then(function (imgPath) {
                    return new Promise(resolve => {
                        imagePath = imgPath;
                        res.status(200).sendFile(imgPath, () => {
                            let imagePathArray = [];
                            //console.log(imagePath);
                            imagePathArray.push(imagePath);
                            console.log(imagePathArray);
                            let del = util_1.deleteLocalFiles(imagePathArray);
                        });
                    });
                });
            }
            else {
                res.status(422).send("invalid url");
            }
        });
    });
    /**************************************************************************** */
    //! END @TODO1
    // Root Endpoint
    // Displays a simple message to the user
    app.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
        res.send("try GET /filteredimage?image_url={{}}");
    }));
    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
}))();
//# sourceMappingURL=server.js.map