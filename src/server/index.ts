import app from './server'
import { launchInputAssetsCronJob } from '../cron/inputsAssets'
import { launchInputLiabilitiesCronJob } from '../cron/inputsLiabilities'

// TO DO - check if cron jobs are running correctly
launchInputAssetsCronJob()
launchInputLiabilitiesCronJob()

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`hello from port ${PORT}`)
})
