const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/diaryDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const diarySchema = new mongoose.Schema({
    title: String,
    content: String,
    date: { type: Date, default: Date.now },
});

const Diary = mongoose.model("Diary", diarySchema);

app.get("/", async (req, res) => {
    const entries = await Diary.find({});
    res.render("index", { entries });
});

app.get("/create", (req, res) => {
    res.render("create");
});

app.post("/create", async (req, res) => {
    const newEntry = new Diary({
        title: req.body.title,
        content: req.body.content,
    });
    await newEntry.save();
    res.redirect("/");
});

app.get("/edit/:id", async (req, res) => {
    const entry = await Diary.findById(req.params.id);
    res.render("edit", { entry });
});

app.post("/update/:id", async (req, res) => {
    await Diary.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        content: req.body.content,
    });
    res.redirect("/");
});

app.post("/delete/:id", async (req, res) => {
    await Diary.findByIdAndDelete(req.params.id);
    res.redirect("/");
});


app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
