const path = require(`path`);
const fs = require('fs-extra');
const _ = require(`lodash`);
const util = require(`util`);
const carbone = require(`carbone`);
const telejson = require(`telejson`);
const bodyParser = require(`body-parser`);
const upload = require(`multer`)({dest: `/tmp/tmp-reports/`});
const { port, enableIndex } = require('./config');
import express, { Request, Response } from 'express';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Create a promise for carbone
const render = util.promisify(carbone.render);

//Main page upload file
app.get('/', (req: Request, res: Response) => {
    if (enableIndex) {
        console.log("Http is Enable Index: " + enableIndex);
        return res.sendFile(path.resolve(`./form.html`)); //form.html is the form to upload the file, this needs to be turned off on production
    } else {
        return res.status(404).send(`Not found`);
    }
});

function addHeaders(res: Response, fileName: string) {
    res.setHeader(`Content-Disposition`, `attachment; filename=${fileName}`);
    res.setHeader(`Content-Transfer-Encoding`, `binary`);
    res.setHeader(`Content-Type`, `application/octet-stream`);
    res.setHeader(`Carbone-Report-Name`, fileName);
}

//Render file and convert type
app.post('/render', upload.single(`template`), async (req: Request, res: Response) => {
    console.log("Request received validating the inputs");
    const template = req.file;
    if (template == null) return res.status(400).send(`Template file is required`);
    if (req.body.data == null) return res.status(400).send(`Json data is required`);

    //Get the data and validate the json
    let data = {};
    try {
        data = JSON.parse(req.body.data);
    } catch (e) {
        console.log(e);
        return res.status(400).send(`Invalid JSON Body, please validate the JSON`);
    }

    console.log("Upload file process started");
    try {
        const originalName = template.originalname.split(`.`).slice(0, -1).join(`.`);
        const originalFormat = template.originalname.split(`.`).reverse()[0];
        const convertToFormat = req.body.format || originalFormat;
        let options = {
            convertTo: convertToFormat,
            outputName: req.body.outputName || `${originalName}.${convertToFormat}`
        };

        let formatters = {};
        try {
            formatters = telejson.parse(req.body.formatters);
        } catch (e) {
            console.error(e);
        }
        // Removing previous custom formatters before adding new ones
        carbone.formatters = _.filter(carbone.formatters, (formatter: { $isDefault: boolean; }) => formatter.$isDefault);
        carbone.addFormatters(formatters);

        console.log(`Original file name ${originalName}`);
        console.log(`Original file format ${originalFormat}`);
        console.debug(`JSON data ${JSON.stringify(data)}`); //This might have sensitive data
        console.log(`Formatters ${JSON.stringify(formatters)}`);
        console.log(`Options ${JSON.stringify(options)}`);
        let report = null;
        console.log(`Files ready to be generated`);
        try {
            console.log("Report generation began");
            report = await render(template.path, data, options);
            console.log("Report generated and will be downloaded shortly");
        } catch (e) {
            console.log(e);
            return res.status(500).send(`Internal server error`);
        } finally {
            console.log(`Uploaded file to be deleted from disk ${template.path}`);
            fs.remove(template.path);
        }
        //Add headers to download the file
        addHeaders(res, options.outputName);
        return res.send(report);
    } catch (e) {
        console.log(e);
        return res.status(500).send(`Internal server error`);
    }
});

app.listen(port, () => console.log(`Carbone wrapper listening on port ${port}!`));
