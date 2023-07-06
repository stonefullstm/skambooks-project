import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { idReader, requiretBooks, requiretReaders, updateBook } from '../actions/action';
import '../App.css';
import biblioteca from '../images/biblioteca.png';
import coverbook from '../images/coverbook.jpg';
import editar from '../images/editar.png';
import excluir from '../images/excluir.png';
import mais from '../images/mais.png';
import troca from '../images/troca.png';
import { myFetch } from '../services/fetchs';
import './exchanges.css';
import { showAlert, showAlertSucces, showAlertConfirm, showAlertSwitch } from './alerts/alert';


class skambooks extends Component {
  state = {
    reader: {},
    disabled: false,
    nome: '',
    id: '',
  };


  async componentDidMount() {
    const token = localStorage.getItem('token');
    const options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'Authorization': `${token}`,
      },
    };
    const { dispatch, history } = this.props;
    const { status, message, data: books } = await myFetch(options, 'books');
    if (status !== 200) {
      showAlert(status, message);
      history.push('/');
    }
    const response = await myFetch(options, 'readers');
    this.setState({
      reader: response.data.id,
    });
    dispatch(idReader(response.data.id));
    const result = requiretBooks(books);
    dispatch(result);
  };

  handleDelete = (id) => {
    showAlertConfirm(id, this.handleExcluir);
  };


  handleExcluir = async (id) => {
      const token = localStorage.getItem('token');
      const options = {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
          'Authorization': `${token}`,
        },
      };
      const { status, message } = await myFetch(options, `books/${id}`);
      if (status === '200') {
        const { book, dispatch } = this.props;
        const result = book.filter((item) => item.id !== id);
        const r = requiretBooks(result);
        dispatch(r);
      }
      showAlert(status, message);
  };

  handleSwitch = (ids) => {
    showAlertSwitch(ids, this.handleReader)
  }

  handleReader = async (ids) => {
      const token = localStorage.getItem('token');
      const options = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
          'Authorization': `${token}`,
        },
      };
      const { dispatch } = this.props;
      const { reader } = this.state;
      const { data } = await myFetch(options, 'readers/names');
      const readerSqt = data.filter((item) => item.id !== reader.id);
      if (data.length > 0) {
        this.setState({
          disabled: true,
          id: ids,
        });
        dispatch(requiretReaders(readerSqt));
      }
  };

  handleSelect = ({ target }) => {
    this.setState({
      nome: target.value,
    })
  };

  handleSender = async (id) => {
    const { nome } = this.state;
    const { readers } = this.props;
    if (nome.length > 0) {
      const result = readers.filter((i) => i.name.includes(nome));
      const token = localStorage.getItem('token');
      const update = {
        receiverId: result[0].id,
        bookId: id,
      };
      const options = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify(update),
      };
      // const { message } = await createExchanges(options);
      const { status, message } = await myFetch(options, 'exchanges');
      showAlertSucces(status, message);
      this.setState({
        disabled: false,
      })
    }
  };

  handleUpdate = (id) => {
    const { dispatch, history } = this.props;
    dispatch(updateBook(id));
    history.push('/update-book');
  };

  handleMais = () => {
    const { history } = this.props;
    history.push('/create-book');
  };

  render() {
    const { reader, disabled, nome, id } = this.state;
    const { book, readers } = this.props;
    const list = book.map((item, index) => {
      if (item.readers.id === reader) {
        return (<div key={index} className='list'>
          <div className='coverbook'>
            {item.coverUrl !== 'coverbook' ? <img src={item.coverUrl} className='img1' alt='CoverUrl' /> : <img src={coverbook} className='img1' alt='CoverUrl' />}
          </div>
          <div className='li-exchange'>
            <li>book: <strong>{item.title}</strong></li>
            {item.authors.map((i) => (<li>author: <strong>{i.name}</strong></li>))}
          </div>
          <div>
            <li>readers: <strong>{item.readers.name}</strong></li>
            <li>year: <strong>{item.year}</strong></li>
          </div>
          {disabled && item.id === id ? <div>
            <p><strong>Whats user?</strong></p>
            <select value={nome} onChange={this.handleSelect}>
              {readers.map((i) => <option value={i.name}>{i.name}</option>)}
            </select>
            <button type='button' onClick={() => this.handleSender(item.id)}> Trocar </button>
          </div> : null}

          <div className='div-button'>
            <button type='button' className='button-list' onClick={() => this.handleUpdate(item.id)}><img src={editar} alt='images' className='img' /></button>
            <button type='button' className='button-list' onClick={() => this.handleDelete(item.id)}><img src={excluir} alt='images' className='img' /></button>
            <button type='button' className='button-list' onClick={() => this.handleSwitch(item.id)}><img src={troca} alt='images' className='img' /></button>
          </div>
        </div>)
      }
      return null;
    });
    return (
      <div>
        <img src={biblioteca} className='img11' alt='CoverUrl' />
        <h1 className='skan'>SKAMBOOKS</h1>
        <header className='header'>
          <h2 className='book'>My books</h2>
          <h2><Link to='/exchange' className='Link'>My exchanges</Link></h2>
          <h2 className='search'><Link to='/search' className='Link'>Search books</Link></h2>
          <h2 className='logout'><Link to='/' className='Link'>Logout</Link></h2>
        </header>
        <h1>My books</h1>
        <button type='button'
          className='button-mais' onClick={this.handleMais}><img src={mais} alt="Images" className='mais' /></button>
        <ol>
          {list}
        </ol>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  book: state.reducerFetch.books,
  readers: state.reducerFetch.reader,
});


export default connect(mapStateToProps)(skambooks);
