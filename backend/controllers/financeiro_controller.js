const Atendimento = require('../models/Atendimento');

exports.financeiro = async (req, res, next) => {
  try {
    const { funcionario } = req;
    const { dataInicial, dataFinal } = req.body;

    const dataInicialDate = new Date(dataInicial);
    const dataFinalAjustada = new Date(dataFinal);
    dataFinalAjustada.setUTCHours(23, 59, 59, 999);

    const filtroBase = {
      realizado: true,
      create_at: {
        $gte: dataInicialDate,
        $lte: dataFinalAjustada,
      },
    };

    if (funcionario.role !== 'admin') {
      filtroBase.funcionario = funcionario._id;
    }

    const realizadoRaw = await Atendimento.aggregate([
      {
        $match: filtroBase,
      },
      {
        $group: {
          _id: '$funcionario',
          quantidade: { $sum: 1 },
          valorTotal: { $sum: '$valor' },
        },
      },
      {
        $lookup: {
          from: 'funcionarios',
          localField: '_id',
          foreignField: '_id',
          as: 'funcionario',
        },
      },
      {
        $unwind: '$funcionario',
      },
      {
        $addFields: {
          nome: '$funcionario.nome',
        },
      },
      {
        $project: {
          _id: 0,
          funcionario: 0,
        },
      },
    ]);

    const realizado = Array.isArray(realizadoRaw) ? realizadoRaw : [];

    if (realizado.length === 0) {
      console.log('Nenhum atendimento encontrado para o período especificado.');
    }

    return res.status(200).json({
      status: 'success',
      realizado,
    });
  } catch (error) {
    console.error('Erro ao obter dados financeiros:', error);
    return next(error);
  }
};
