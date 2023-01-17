const { Router } = require('express');
// require('dotenv').config();
const { X_CLIENT_SECRET, X_PROJECT_ID, RECIPIENT } = require("../../config")
const fetch = require('node-fetch');

const router = Router();

router.post('/mint', async (req, res) => {
  const { name, image, description, attributes, email } = req.body

  const url = `https://staging.crossmint.com/api/2022-06-09/collections/default-polygon/nfts/${name}`;
  const options = {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      'x-client-secret': X_CLIENT_SECRET,
      'x-project-id': X_PROJECT_ID
    },
    body: JSON.stringify({
      recipient: `email:${email}:polygon`,
      metadata: {
        name,
        image,
        description,
        attributes
      }
    })
  };

  let mint_result;
  await fetch(url, options)
    .then(response => response.json())
    .then(result => mint_result = result)
    .catch(error => mint_result = { msgError: error });

  let statusCode
  mint_result.msgError ? statusCode = 400 : statusCode = 200

  res.status(statusCode).json(mint_result)

})

router.get('/mint', async (req, res) => {

  const { id } = req.query

  const url = `https://staging.crossmint.com/api/2022-06-09/collections/default-polygon/nfts/${id}`;
  const options = {
    method: 'GET',
    headers: {
      'x-client-secret': X_CLIENT_SECRET,
      'x-project-id': X_PROJECT_ID
    }
  };

  let check_result;
  await fetch(url, options)
    .then(response => response.json())
    .then(result => check_result = result)
    .catch(error => check_result = { msgError: error });

  while (!check_result.msgError && check_result.onChain.status === "pending") {
    // if (mint_status.error) {
    //   await interaction.followUp({ content: `Error minting the NFT.`, ephemeral: true });
    //   return false;
    // }
    await new Promise(r => setTimeout(r, 5000)); // 5 seconds
    await fetch(url, options)
      .then(response => response.json())
      .then(result => check_result = result)
      .catch(error => check_result = { msgError: error });
  }

  let statusCode
  check_result.msgError ? statusCode = 400 : statusCode = 200

  res.status(statusCode).json(check_result)

})

router.get("/", (req, res) => {
  res.json({ msg: "Hola" })
})

module.exports = router;
