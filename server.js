const express = require('express')
const dotenv = require("dotenv");
const app = express()

//middleware
dotenv.config()
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//routes
const dataRoutes = require("./routes/data");

app.use('/',dataRoutes)

const PORT = process.env.PORT||5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
