import { Router } from 'express'
import {
  getAccountsAssets,
  getAccountsLiabilities,
  createAccountAssets,
  createAccountLiabilities
   } from './handlers/accounts'
import {
  createInputAssets
} from './handlers/inputs'

const router = Router()

router.get('/accounts-assets', getAccountsAssets)
router.get('/accounts-liabilities', getAccountsLiabilities)

router.post('/create-account-assets', createAccountAssets)
router.post('/create-account-liabilities', createAccountLiabilities)

router.post('/input-assets', createInputAssets)
router.post('/input-liabilities', (req,res) => {})

router.put('/input-assets/:id', (req,res) => {})
router.put('/input-liabilities/:id', (req,res) => {})

router.get('/summary-metrics', (req,res) => {})
router.get('/summary-metrics/currency', (req,res) => {})
router.get('/summary-metrics/type', (req,res) => {})
router.get('/timeseries', (req, res)=> {
  res.json({message: 'timeseries'})
})

export default router