import express from "express";
import myMongoDB from "../db/myMongoDB";

const router = express.Router();

router.get("/cards", async (req, res) => {
  console.log("Received request for /api/cards", req.query);
  const { team } = req.query;
  const query = {};
  if (team) {
    query.team = { $regex: team, $options: "i" };
  }
 
  try {
    const cards = await myMongoDB.getCards(query);
    res.json({
      cards,
    });
  } catch (error) {
    throw error;
  }
});

router.post("/cards", async (req, res) => {
    console.log("Received POST");
    const { team, first_name, last_name, State, year, price } = req.body;
    if (!team || !first_name || !last_name || !State || year == null || price == null ) {
        return res.status(400);
    }

    try {
        const card = await myMongoDB.createCard({
            team,
            first_name,
            last_name,
            State,
            year: Number(year),
            price: Number(price)
        });
        res.status(201).json({ card })
    } catch (err) {
        throw err;
    }
})




export default router;