import { Router } from 'express'
import {
  getAccountAssets,
  getAccountLiabilities,
  createAccountAssets,
  createAccountLiabilities
   } from './handlers/accounts'

const router = Router()

router.get('/account-assets', getAccountAssets)
router.get('/account-liabilites', getAccountLiabilities)

router.post('/create-account-assets', createAccountAssets)
router.post('/create-account-liabilites', createAccountLiabilities)

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

export default router