import { INTEGER, Model, STRING } from 'sequelize';
import db from '.';
import Leitor from './leitores.model';

class Livro extends Model {
  declare id: number;
  declare isbn: string;
  declare titulo: string;
  declare ano: string;
  declare paginas: number;
  declare idLeitor: number;
}

Livro.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  isbn: {
    type: STRING(13),
    allowNull: false,
  },
  titulo: {
    type: STRING(255),
    allowNull: false,
  },
  ano: {
    allowNull: false,
    type: STRING(4),
  },
  paginas: {
    allowNull: false,
    type: INTEGER,
  },
  idLeitor: {
    allowNull: false,
    type: INTEGER,
    field: 'id_leitor',
  },
}, 
{
  // ... Outras configs
  underscored: true,
  sequelize: db,
  modelName: 'livros',
  timestamps: false,
});

Leitor.hasMany(Livro, { foreignKey: 'idLeitor', as: 'livros' });
Livro.belongsTo(Leitor, { foreignKey: 'idLeitor', as: 'livros' });

export default Livro;