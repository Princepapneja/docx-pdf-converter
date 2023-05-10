let express = require("express");
let bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
let docxToPdf = require('docx-pdf');

const app = express();

app.use(express.static('docx'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/docx");
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

let upload = multer({storage: storage});

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/convert", upload.single('file'), (req, res) => {
    let outputFilePath = "pdf/output.pdf";
    docxToPdf(req.file.path, outputFilePath, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.download(outputFilePath, () => {
            });
        }
    });
});

app.listen(5000, () => {
    console.log('Server started on port 3000');
});
