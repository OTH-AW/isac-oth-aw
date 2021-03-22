const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Helps with mongodb-connection
const workpieceRouter = require('./routes/workpiece');
const printRouter = require('./routes/print');
const storageRouter = require('./routes/storage');
const piRouter = require('./routes/pi');
const qualityControlRouter = require('./routes/qualityControl');
const mergeHelper = require('./helper/mongo/merge')

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const host = process.env.MONGODB_HOST;
mongoose.connect(`mongodb://${host}:27017/small-smart-factory`, { 
    useNewUrlParser: true, 
    useCreateIndex: true,
    // useUnifiedTopology: true,
    replicaSet: "rs0"
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
    mergeHelper.tryMergeOrdersAndWorkpieces(null, null, () => {workpieceRouter.startPrintForOrdersWithoutWst()});
})

app.use('/workpiece', workpieceRouter.router);
app.use('/print', printRouter.router);
app.use('/storage', storageRouter.router);
app.use('/qc', qualityControlRouter.router);
app.use('/pi', piRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})