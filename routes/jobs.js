const router =require("express").Router();
const pool = require("../config/db")

router.get('/', async function (req, res){
  try {
    const jobs = await pool.query('SELECT * FROM job')
    res.status(200).json(jobs.rows)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

router.post('/',async function (req, res) {
try {
  const newJob = await pool.query(`
    INSERT INTO job (title) VALUES ($1) RETURNING *
  `, [req.body.title])
  
  res.status(201).json(newJob.rows)
} catch (error) {
  res.status(500).json({message: error.message})
}
})

router.delete('/:id',async function (req, res) {
  const {id} = req.params
  try {
    await pool.query("DELETE FROM employer WHERE job_id = $1", [id])
    await pool.query("DELETE FROM job WHERE id = $1", [id])
    res.status(200).json({message: 'Job deleted successfully'})
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

module.exports = router