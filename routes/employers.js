const router = require("express").Router();
const pool = require("../config/db");

router.get("/", async function (req, res) {
  try {
    const employers = await pool.query("SELECT * FROM employer");
    res.status(200).json(employers.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async function (req, res) {
  const { id } = req.params;
  try {
    const employers = await pool.query(
      "SELECT * FROM employer LEFT JOIN job ON job.id = employer.job_id WHERE employer.id = $1",
      [id]
    );
    res.status(200).json(employers.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async function (req, res) {
  try {
    const { name, degree, salary, job_id } = req.body;
    const newEmployer = await pool.query(
      `
      INSERT INTO employer (name, degree, salary, job_id) VALUES ($1, $2, $3, $4) RETURNING *
    `,
      [name, degree, salary, job_id]
    );

    res.status(201).json(newEmployer.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async function (req, res) {
  const { id } = req.params;
  const { name, degree, salary, job_id } = req.body;
  try {
    const oldEmployer = await pool.query("SELECT * FROM employer WHERE id = $1", [id]);
    const updatedEmployer = await pool.query(
      "UPDATE employer SET name = $1, degree = $2, salary = $3, job_id = $4 WHERE id = $5 RETURNING *",
      [
        name || oldEmployer.rows[0].name,
        degree || oldEmployer.rows[0].degree,
        salary || oldEmployer.rows[0].salary,
        job_id || oldEmployer.rows[0].job_id,
        id,
      ]
    );

    res.status(202).json(updatedEmployer.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async function (req, res) {
  const { id } = req.params;
  try {
    const employer = await pool.query("DELETE FROM employer WHERE id = $1 RETURNING *", [id]);
    res.status(200).json(employer.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
