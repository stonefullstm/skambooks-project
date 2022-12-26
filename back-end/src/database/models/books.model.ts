import { INTEGER, Model, STRING } from 'sequelize';
import db from '.';
import AuthorsBooks from './authors-books.model';
import Author from './authors.model';
import Reader from './readers.model';

class Book extends Model {
  declare id: number;
  declare isbn: string;
  declare title: string;
  declare year: string;
  declare pages: number;
  declare readerId: number;
  declare authors?: Author[];
}

Book.init({
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
  title: {
    type: STRING(255),
    allowNull: false,
  },
  year: {
    allowNull: false,
    type: STRING(4),
  },
  pages: {
    allowNull: false,
    type: INTEGER,
  },
  readerId: {
    allowNull: false,
    type: INTEGER,
    field: 'reader_id',
  },
}, 
{
  // ... Outras configs
  underscored: true,
  sequelize: db,
  modelName: 'books',
  timestamps: false,
});

Reader.hasMany(Book, { foreignKey: 'reader_id', as: 'readers' });
Book.belongsTo(Reader, { foreignKey: 'reader_id', as: 'readers' });
Author.belongsToMany(Book, { foreignKey: 'author_id', as: 'books',
 through: AuthorsBooks, otherKey: 'book_id' });

Book.belongsToMany(Author, { foreignKey: 'book_id', as: 'authors',
 through: AuthorsBooks, otherKey: 'author_id' });
 
export default Book;