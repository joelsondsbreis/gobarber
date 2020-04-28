// vai impedir que algumas rotas sejam acessadas sem autenticação, vai fazer a verificação se o usuario está logado
import jwt from 'jsonwebtoken';
import { promisify } from 'util'; // permite usar async/await em funções de callback
import authConfig from '../../config/auth'; // aqui está o 'segredo do token' para descri ptografar e ver se ele está valido

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // validação se foi enviado o token
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }
  // vai retornar o arrway com bearer e o token (sintaxe do envio de token), descartando a primeira posição e pegando apenas o token
  const [, token] = authHeader.split(' ');

  try {
    // no decoder vao estar as informações na hora da geração do token (payload)
    const decoded = await promisify(jwt.verify)(token, authConfig.secret); // está chamando a função retornada de jwt.verify

    // adicionando dentro do req o userId para pegar o id do usuário a partir do token
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
