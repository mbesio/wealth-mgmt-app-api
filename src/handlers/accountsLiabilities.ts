import prisma from '../server/db'

export const createAccountLiabilities = async (req, res) => {
  const { name, currency, startDate, principal, interestRate, term, isActive } =
    req.body
  const accountLiabilities = await prisma.accountLiabilities.create({
    data: {
      name,
      currency,
      startDate,
      principal,
      interestRate,
      term,
      isActive,
    },
  })
  res.json({ data: accountLiabilities })
}

export const getAccountsLiabilities = async (req, res) => {
  const accountLiabilities = await prisma.accountLiabilities.findMany()
  res.json({ data: accountLiabilities })
}

export const toggleIsActiveAccountLiabilites = async (req, res) => {
  const { id } = req.params
  const { isActive } = req.body
  const accountLiabilities = await prisma.accountLiabilities.update({
    where: {
      id: id,
    },
    data: {
      isActive,
    },
  })
  res.json({ data: accountLiabilities })
}

export const deleteAccountLiabilities = async (req, res) => {
  const { id } = req.params
  await prisma.accountLiabilities.delete({
    where: {
      id,
    },
  })
  res.json({ data: `Account Liability ${id} succesfully deleted` })
}
