import prisma from "../server/db"

export const getInputAssets = async (req, res) => {
  res.json({data: 'hello from getInputAssets'})
}

export const getInputLiabilites = async (req, res) => {
  res.json({data: 'hello from getInputLiabilites'})
}

export const createInputAssets = async (req, res) => {
  res.json({data: 'hello from createInputAssets'})
}

export const createInputLiabilities = async (req, res) => {
  res.json({data: 'hello from createInputLiabilities'})
}

export const createFx = async (req, res) => {
  res.json({data: 'hello from createFx'})
}