import Sequelize, { Model } from 'sequelize';

class File extends Model {
  // método que vai ser chamado automaticamente pelo sequeliza
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default File;
