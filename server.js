const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  // console.error('Exception! Desligando...');
  // console.log(err.name, err.message);
  process.exit(1);
});

// Configuração inicial do dotenv
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: "./config.env" });
} else {
  dotenv.config({ path: "./config.dev.env" });
}

const app = require("./app");

const PORT = process.env.PORT || 3000;

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB) // Corrigido: removido os parênteses extras e passado as opções corretamente
  .then(() => {
    console.log("DB connection successful!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

process.on("unhandledRejection", (err) => {
  console.error("Rejection! Desligando...");
  console.log(err, err.message);
  server.close(() => {
    // 0 representa sucesso, 1 representa uma exceção não detectada
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED. Desligando o servidor...");
  server.close(() => {
    console.log("Process terminated!");
  });
});
