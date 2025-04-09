const Funcionarios = require('../models/Funcionarios');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const multer = require('multer');
const { criarRespostaErro } = require('../utilities/utils');

const filterObj = (obj, ...camposPermitidos) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (camposPermitidos.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.listar_funcionarios = async (req, res, next) => {
  try {
    const funcionarios = await Funcionarios.find();

    res.status(200).send(funcionarios);
  } catch (error) {
    next(error);
  }
};

exports.cadastro_especialista = async (req, res, next) => {
  try {
    const newFuncionario = await Funcionarios.create({
      nome: req.body.nome,
      email: req.body.email,
      telefone: req.body.telefone,
      profissao: req.body.profissao,
      password: req.body.password,
      confirm_password: req.body.confirm_password,
      role: req.body.role,
      descricao: req.body.descricao,
    });

    await newFuncionario.save();

    res.status(201).json({
      status: 'success',
      message: 'Especialista cadastrado com sucesso.',
      funcionarioId: newFuncionario.id,
    });
  } catch (error) {
    next(error);
  }
};

// Configuração do armazenamento na memória
const multerStorage = multer.memoryStorage();

// Filtro de arquivos para aceitar apenas imagens
const multerFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    const error = new Error('Apenas imagens são permitidas!');
    error.statusCode = 400;
    cb(new Error(error), false);
  }
};

// upload de imagem
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// middleware para upload de imagem
exports.uploadUserPhoto = upload.single('foto');

// redimensionar imagem do usuario
exports.resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.funcionario.nome}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 80 })
    .toFile(
      path.join(__dirname, '../public/images/fotos_perfil', req.file.filename),
    );

  req.body.foto = path.join('public/images/fotos_perfil', req.file.filename);

  next();
};

exports.buscar_especialista = async (req, res, next) => {
  try {
    const { id } = req.params;
    const especialista = await Funcionarios.findById(id);

    if (!especialista) {
      return res.status(404).send({
        status: 'fail',
        message: 'Especialista não encontrado.',
      });
    }

    res.status(200).send({
      status: 'success',
      data: {
        especialista,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.update_especialista = async (req, res, next) => {
  try {
    if (req.body.password || req.body.confirm_password) {
      return res.status(400).send({
        status: 'fail',
        message: 'Não é possível atualizar a senha por aqui.',
      });
    }

    const filteredBody = filterObj(
      req.body,
      'nome',
      'telefone',
      'profissao',
      'email',
      'descricao',
      'instagram',
      'valor_consulta',
    );

    if (req.file) {
      filteredBody.foto = req.file.filename; // Adiciona o nome do arquivo ao corpo da requisição
    }

    const updatedFuncionario = await Funcionarios.findByIdAndUpdate(
      req.body._id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      status: 'success',
      data: {
        funcionario: updatedFuncionario,
      },
      message: 'Especialista atualizado com sucesso.',
    });
  } catch (error) {
    next(error);
  }
};
