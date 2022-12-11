import { Router } from 'express'
import {
  getAccountsAssets,
  getAccountsLiabilities,
  createAccountAssets,
  createAccountLiabilities
   } from '../handlers/accounts'
import {
  createFx,
  createInputAssets,
  createInputLiabilities
} from '../handlers/inputs'
import {
  getTimeseries
} from '../handlers/outputs'

const router = Router()

router.get('/accounts-assets', getAccountsAssets)
router.get('/accounts-liabilities', getAccountsLiabilities)

router.post('/create-account-assets', createAccountAssets)
router.post('/create-account-liabilities', createAccountLiabilities)

router.post('/input-assets', createInputAssets)
//ideally this is not required and I just compute the repayment plan based on the loan parameters
router.post('/input-liabilities', createInputLiabilities)

router.put('/input-assets/:id', (req,res) => {})
router.put('/input-liabilities/:id', (req,res) => {})

router.post('/addfx', createFx)

router.get('/summary-metrics', (req,res) => {})
router.get('/summary-metrics/currency', (req,res) => {})
router.get('/summary-metrics/type', (req,res) => {})
router.get('/timeseries', getTimeseries)

export default router