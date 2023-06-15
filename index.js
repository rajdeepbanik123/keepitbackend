import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://banikrajdeep03:raj123@cluster0.n0uwdqa.mongodb.net/mykeepitAppDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected");

    const keeperSchema = mongoose.Schema({
      title: String,
      description: String,
    });

    const Keeper = mongoose.model("Keeper", keeperSchema);

    app.get("/api/getAll", (req, res) => {
        Keeper.find({})
          .exec()
          .then((keeperList) => {
            res.status(200).send(keeperList);
          })
          .catch((err) => {
            console.log(err);
            res.sendStatus(500);
          });
      });
      
   
  
app.post("/api/addNew", (req, res) => {
    const { title, description } = req.body;
    const keeperObj = new Keeper({
        title,
        description
    });

    keeperObj.save()
        .then(() => {
            return Keeper.find({}); // Retrieve all keepers
        })
        .then((keeperList) => {
            res.status(200).send(keeperList); // Send the updated keeper list
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500); // Send an error status code
        });
});

   


    app.post("/api/delete", (req, res) => {
        const { id } = req.body;
        Keeper.deleteOne({ _id: id })
            .then(() => {
                return Keeper.find({}); // Retrieve all keepers
            })
            .then((keeperList) => {
                res.status(200).send(keeperList); // Send the updated keeper list
            })
            .catch((err) => {
                console.log(err);
                res.sendStatus(500); // Send an error status code
            });
    });
    

    app.listen(process.env.PORT||3001, () => {
      console.log("Backend created at port 3001");
    });
  })
  .catch((error) => {
    console.error("An error occurred during database connection:", error);
  });
