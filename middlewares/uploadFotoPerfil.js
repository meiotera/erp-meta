const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configuração do armazenamento na memória
const multerStorage = multer.memoryStorage();

// Filtro de arquivos para aceitar apenas imagens
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new AppError("Não é uma imagem! Por favor, envie apenas imagens.", 400),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

module.exports = upload;
