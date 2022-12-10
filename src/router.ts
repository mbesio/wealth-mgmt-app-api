import { Router } from "express"

const router = Router()

router.post('/create-account-assets', (req,res) => {})
router.post('/create-account-liabilites', (req,res) => {})

router.post('/input-assets', (req,res) => {})
router.put('/input-assets/:id', (req,res) => {})

router.post('/input-liabilities', (req,res) => {})
router.put('/input-liabilities/:id', (req,res) => {})

router.get('/summary-metrics', (req,res) => {})
router.get('/summary-metrics/currency', (req,res) => {})
router.get('/summary-metrics/type', (req,res) => {})

router.get('/timeseries', (req, res)=> {
  res.json({message: 'timeseries'})
})

export default router;