const express = require("express");
const server = express();
const fs = require("fs").promises; // Usando 'fs.promises' para trabalhar com promessas
const path = require("path"); 
const DATA_FILE = path.join(__dirname, "./data.json");
const cors = require("cors");
server.use(cors());

// Middleware para interpretar JSON
server.use(express.json());
const port = process.env.PORT || 5000;


server.post("/envio-api", async (req, res) => {
  const { name } = req.body; // Obtendo diretamente o 'name' de req.body
  const lista = { name };

  try {
    // Tenta ler o arquivo ou retorna um array vazio se o arquivo não existir
    let data = await fs.readFile(DATA_FILE, "utf-8").catch((err) => {
      if (err.code === "ENOENT") {
        return JSON.stringify([]); // Retorna array vazio se arquivo não existe
      }
      throw err; // Lança erro para tratamento
    });

    const listaNomes = JSON.parse(data);
    listaNomes.push(lista);

    // Escreve a lista atualizada no arquivo
    await fs.writeFile(DATA_FILE, JSON.stringify(listaNomes, null, 2));
    res.status(200).json({ message: "Item salvo com sucesso" });
  } catch (err) {
    console.error(err); // Log do erro no console para depuração
    res.status(500).json({ error: "Erro ao salvar o arquivo" });
  }
});

server.listen(port, () => {
  console.log("Servidor rodando na porta:", port);
});
