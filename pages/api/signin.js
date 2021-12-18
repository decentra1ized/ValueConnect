// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import nextConnect from "next-connect"
import fs from 'fs'

const app = nextConnect({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` })
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` })
  },
});
app.post('*', function (req, res) {
  const writeData = Object.assign({}, req.body)
  delete writeData.address
  fs.writeFileSync(`./public/samples/userinfo/${req.body.address}.json`, JSON.stringify(writeData))
  res.status(200).json({ work: 'done' })
})
export default app
