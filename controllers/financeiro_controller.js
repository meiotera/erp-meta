const Atendimento = require("../models/Atendimento");

exports.financeiro = async (req, res, next) => {
  try {
    const { funcionario } = req;
    const { dataInicial, dataFinal } = req.body;

    // Convertendo as datas de string para objeto Date
    const dataInicialDate = new Date(dataInicial);
    const dataFinalAjustada = new Date(dataFinal);
    dataFinalAjustada.setUTCHours(23, 59, 59, 999);

    // Definir o filtro base para atendimentos realizados dentro do período
    const filtroBase = {
      realizado: true,
      create_at: {
        $gte: dataInicialDate,
        $lte: dataFinalAjustada,
      },
    };

    // Se o usuário não for admin, adicionar o filtro para o ID do funcionário
    if (funcionario.role !== "admin") {
      filtroBase.funcionario = funcionario._id;
    }

    // Usar agregação para obter a quantidade de atendimentos realizados e o valor total
    const realizado = await Atendimento.aggregate([
      {
        $match: filtroBase,
      },
      {
        $group: {
          _id: "$funcionario",
          quantidade: { $sum: 1 },
          valorTotal: { $sum: "$valor" },
        },
      },
      {
        $lookup: {
          from: "funcionarios",
          localField: "_id",
          foreignField: "_id",
          as: "funcionario",
        },
      },
      {
        $unwind: "$funcionario",
      },
      {
        $addFields: {
          nome: "$funcionario.nome",
        },
      },
      {
        $project: {
          _id: 0,
          funcionario: 0,
        },
      },
    ]);

    // Verificando se algum atendimento foi encontrado
    if (realizado.length === 0) {
      console.log("Nenhum atendimento encontrado para o período especificado.");
    }

    // Retorno da resposta com os dados agregados
    return res.status(200).json({
      status: "success",
      data: {
        realizado,
      },
    });
  } catch (error) {
    // Tratamento de erro
    console.error("Erro ao obter dados financeiros:", error);
    return next(error);
  }
};
