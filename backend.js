import express from 'express';
import cardsRouter from './routes/cards.js';

console.log("Init backend...");

const app = express();
const PORT = process.env.PORT || 3300;

app.use(express.json()); 
app.use(express.static("frontend"));

app.use("/api", cardsRouter);

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`); 
})