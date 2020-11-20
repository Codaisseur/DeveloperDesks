const { Router } = require("express");
const { desk: Desk, developer: Developer } = require("../models");
const authMiddleware = require("../auth/middleware");

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const desks = await Desk.findAndCountAll({
      include: [{ model: Developer, attributes: ["id", "name", "email"] }],
    });

    res.json({ total: desks.count, results: desks.rows });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const desk = await Desk.findByPk(id, {
      include: [{ model: Developer, attributes: ["id", "name", "email"] }],
    });
    if (!desk) {
      return res.status(404).send("Desk not found");
    }

    res.json(desk);
  } catch (e) {
    next(e);
  }
});

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const {
      user,
      body: { uri, title, latitude, longitude },
    } = req;
    if (!uri || !title) {
      return res.status(400).send("Missing parameters");
    }
    await Desk.create({
      uri,
      title,
      developerId: user.id,
      latitude,
      longitude,
    });
    res.send({ status: "success" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
