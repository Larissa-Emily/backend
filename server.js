const express = require("express");
const server = express();
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");

server.use(cors());
server.use(express.json());

const port = process.env.PORT || 5000;

// Usando um diretório temporário para armazenar o arquivo
const DATA_FILE = path.join("/tmp", "data.json");

server.get("/", (req, res) => {
  return res.json("Hello world");
});

server.post("/envio-api", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "O campo 'name' é obrigatório." });
  }

  const lista = { name };

  try {
    let data = await fs.readFile(DATA_FILE, "utf-8").catch((err) => {
      if (err.code === "ENOENT") {
        return JSON.stringify([]);
      }
      throw err;
    });

    const listaNomes = JSON.parse(data);
    listaNomes.push(lista);

    await fs.writeFile(DATA_FILE, JSON.stringify(listaNomes, null, 2));
    res.status(200).json({ message: "Item salvo com sucesso" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Erro ao salvar o arquivo", details: err.message });
  }
});

server.listen(port, () => {
  console.log("Servidor rodando na porta:", port);
});
