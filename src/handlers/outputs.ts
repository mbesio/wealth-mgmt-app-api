import prisma from '../server/db'

export const getTimeseries = async (req, res) => {
  res.json({
    data: 'hello from getTimeseries'
  })
}

export const getSummaryMetrics = async (req, res) => {
  res.json({
    data: 'hello from getSummaryMetrics'
  })
}