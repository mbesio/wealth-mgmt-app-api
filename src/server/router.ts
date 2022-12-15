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
  createInputAssets,
  getInputAssets,
  updateInputAssetAmount
} from '../handlers/inputsAssets'
import {
  createInputLiabilities,
  getInputLiabilites
} from '../handlers/inputsLiabilites'
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
router.put('/account-liabilities/toggle-active/:id', toggleIsActiveAccountLiabilites)
router.delete('/account-liabilities/:id', deleteAccountLiabilities)

// Input Assets
router.post('/input-assets', createInputAssets) // called by cron job monthly
router.get('/input-assets', getInputAssets)
router.put('/input-assets/amount/:id', (updateInputAssetAmount) => {}) // manually only update amount

// Input Liabilities
router.post('/input-liabilities', createInputLiabilities) // called by cron job monthly
router.get('/input-liabilities', getInputLiabilites)
router.put('/input-liabilities/amount/:id', (req,res) => {}) // should not be required

// Outputs
router.get('/summary-metrics', getSummaryMetrics)
router.get('/summary-metrics/currency', (req,res) => {})
router.get('/summary-metrics/type', (req,res) => {})
router.get('/timeseries', getTimeseries)

export default router