import { Router } from 'express'
import {
  getAccountsAssets,
  getAccountsLiabilities,
  createAccountAssets,
  createAccountLiabilities,
  deleteAccountLiabilities
   } from '../handlers/accounts'
import {
  createFx,
  createInputAssets,
  createInputLiabilities,
  getInputAssets,
  getInputLiabilites
} from '../handlers/inputs'
import {
  getSummaryMetrics,
  getTimeseries
} from '../handlers/outputs'

const router = Router()

// Accounts
router.get('/accounts-assets', getAccountsAssets)
router.get('/accounts-liabilities', getAccountsLiabilities)

router.post('/account-assets', createAccountAssets)
router.post('/account-liabilities', createAccountLiabilities)

router.put('/account-assets/:id', () => {})
router.put('/account-liabilities/:id', () => {})

router.delete('/account-assets/:id', () => {}) // user will not delete accounts, only deactivate
router.delete('/account-liabilities/:id', deleteAccountLiabilities) // user will not delete accounts, only deactivate

// Inputs
router.get('/input-assets', getInputAssets)
router.get('/input-liabilities', getInputLiabilites)

router.post('/input-assets', createInputAssets) // called by cron job monthly
router.post('/input-liabilities', createInputLiabilities) // called by cron job monthly

router.put('/input-assets/:id', (req,res) => {}) // manually only update principal
router.put('/input-liabilities/:id', (req,res) => {})

router.post('/addfx', createFx) // should not be required

// Outputs
router.get('/summary-metrics', getSummaryMetrics)
router.get('/summary-metrics/currency', (req,res) => {})
router.get('/summary-metrics/type', (req,res) => {})
router.get('/timeseries', getTimeseries)

export default router