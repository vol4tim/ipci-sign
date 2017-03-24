import express from "express";
import cors from "cors";
import _ from "lodash";
import * as utils from "./utils";

const SECRET = process.env.SECRET || '';

const app = express()

app.use(cors());

app.get('/', (req, res) => {
  res.status(200).send('ok')
})

// http://localhost:3001/sign/0x1c0cd50ae66352289181865cfa839c2bc8b7e9b3/5/0xd8215991997bf965ba4da769087a6cfd61c01e16/secret
app.get('/sign/:token/:amount/:complier/:secret', (req, res) => {
  if (req.params.secret != SECRET) {
    return res.status(404).send('FAIL');
  }
  utils.sign(req.params.token, req.params.amount, req.params.complier)
    .then((raw) => {
      res.status(200).send({
        raw: raw
      });
    })
    .catch((e) => {
      let message = 'error';
      if (_.isString(e)) {
        message = e;
      } else if (_.has(e, 'response') && _.has(e.response, 'statusText')) {
        message = e.response.statusText;
      }
      res.status(500).send({
        error: message
      });
    })
})

app.listen(3000)
