import { Router } from 'express'
import {
  createAccountAssets,
  getAccountsAssets,
  toggleIsActiveAccountAssets,
  deleteAccountAssets
   } from '../handlers/accountsAssets'
import {
  createAccountLiabilities,
  getAccountsLiabilities,
  toggleIsActiveAccountLiabilites,
  deleteAccountLiabilities
    } from '../handlers/accountsLiabilities'
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

// Accounts Assets
router.post('/account-assets', createAccountAssets)
router.get('/accounts-assets', getAccountsAssets)
router.put('/account-assets/toggle-active/:id', toggleIsActiveAccountAssets)
router.delete('/account-assets/:id', deleteAccountAssets)

// Accounts Liabilities
router.post('/account-liabilities', createAccountLiabilities)
router.get('/accounts-liabilities', getAccountsLiabilities)
router.put('/account-liabilities/:id', toggleIsActiveAccountLiabilites)
router.delete('/account-liabilities/:id', deleteAccountLiabilities)

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