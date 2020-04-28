import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  // método que vai ser chamado automaticamente pelo sequeliza
  static init(sequelize) {
    super.init(
      {
        // super é uma classe pai (está chamando o método init da classe Model)
        // colunas que vao ter na db
        // aqui vai ser o primeiro parametro do init contendo todos os valores que o usuario pode receber
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // VIRTUAL significa que esse campo nao vai existir no db
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    // hook são trechos de código que sao executados de forma automatica baseado em ações que acontecem no model
    // esse hook vai ser executado antes de qualquer save em um usuario
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  // relacionando o avatar com o usuario
  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' }); // belongsTo é tipo de relacionamento que se traduz a "pertence a"
  }

  // fazendo validação de senha do usuario
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
