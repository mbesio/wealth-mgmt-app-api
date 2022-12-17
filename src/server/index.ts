import app  from './server'
import { launchInputAssetsCronJob } from '../cron/inputsAssets'

launchInputAssetsCronJob() // TO DO - check if cron job is running correctly
// TO DO - add the liability cron job

app.listen(3001, () => {
  console.log('hello from port 3001')
})