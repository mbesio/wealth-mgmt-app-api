import app from './server'
import { launchInputAssetsCronJob } from '../cron/inputsAssets'
import { launchInputLiabilitiesCronJob } from '../cron/inputsLiabilities'

// TO DO - check if cron jobs are running correctly
launchInputAssetsCronJob()
launchInputLiabilitiesCronJob()

app.listen(3001, () => {
  console.log('hello from port 3001')
})
