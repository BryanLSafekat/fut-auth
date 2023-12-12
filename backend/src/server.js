const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const axios = require("axios");

const app = express();
const port = 8080;

let accessToken = null;
let refreshToken = null;

app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use(cors());

const client = new OAuth2Client({
  clientId:
    "20670889963-v97hgkotjllfv59rchgv3jga39gaqcs0.apps.googleusercontent.com",
  clientSecret: "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",
  redirectUri: "http://localhost:8080/callback",
});

const clearSessionCookies = (res) => {
  res.clearCookie("token");
};

app.get("/auth/google", (req, res) => {
  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  });
  res.redirect(authUrl);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const { tokens } = await client.getToken(code);

    accessToken = tokens.access_token;
    refreshToken = tokens.refresh_token;

    const user = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience:
        "20670889963-v97hgkotjllfv59rchgv3jga39gaqcs0.apps.googleusercontent.com",
    });

    const userData = user.getPayload();

    res.json(userData);
  } catch (error) {
    console.error("Error al obtener token", error);

    res.status(500).send("Error en la autenticación");
  }
});

app.post("/logout", (req, res) => {
  accessToken = null;
  refreshToken = null;

  clearSessionCookies(res);

  res.status(200).send("Sesion cerrada exitosamente");
});

app.get("/api/futbolistas", (req, res) => {
  res.sendFile(path.join(__dirname, "../api.json"));
});

app.get("/userData", async (req, res) => {
  try {
    if (!accessToken) {
      
      return;
    }

    const googleResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const userData = googleResponse.data;

    res.json(userData);
  } catch (error) {
    console.error("Error al obtener datos del usuario: ", error);
    res.status(500).send("Error al obtener datos del usuario");
  }
});

app.get("/api/futbolistas/:id", (req, res) => {
  const { id } = req.params;

  try {
    const filePath = path.join(__dirname, "../api.json");
    const futbolistas = require(filePath);

    const futbolista = futbolistas.find((f) => f.id === parseInt(id));

    if (!futbolista) {
      res.status(404).json({ message: "Futbolista no encontrado" });
      return;
    }

    res.status(200).json(futbolista);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el futbolista" });
  }
});

app.put("/api/futbolistas/:id/votes", (req, res) => {
  const { id } = req.params;
  const { votes } = req.body;

  fs.readFile(path.join(__dirname, "../api.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error al leer el archivo api.json" });
      return;
    }

    try {
      const futbolistas = JSON.parse(data);

      const futbolista = futbolistas.find((f) => f.id === parseInt(id));

      if (!futbolista) {
        res.status(404).json({ message: "Futbolista no encontrado" });
        return;
      }

      futbolista.votes = futbolista.votes ? futbolista.votes + 1 : 1;

      fs.writeFile(
        path.join(__dirname, "../api.json"),
        JSON.stringify(futbolistas),
        "utf8",
        (err) => {
          if (err) {
            console.error(err);
            res
              .status(500)
              .json({ message: "Error al escribir en el archivo api.json" });
            return;
          }
          res.status(200).json({
            message: `Voto actualizado para el futbolista con ID ${id}`,
          });
        }
      );
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error al procesar los datos del archivo api.json" });
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor en funcionamiento: en ${port}`);
});
