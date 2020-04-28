// controle de autenticação de usuario
import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    // validando se o req.body está de acordo com o schema definido
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    // verificando se o email que usario está tentado acessar existe
    const user = await User.findOne({ where: { email } });

    // usuario nao autorizado
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // validação de senha do usuario com o metodo criado no model de user
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      // passando o payload como parametro de sign e uma string unica, e algumas configurações do token
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
