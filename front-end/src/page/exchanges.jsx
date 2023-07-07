import React, { Component } from 'react';
import '../App.css';
import biblioteca from '../images/biblioteca.png';
import confirme from '../images/confirme.png';
import coverbook from '../images/coverbook.jpg';
import excluir from '../images/excluir.png';
import { myFetch } from '../services/fetchs';
import './exchanges.css';
import Navbar from './navbar/Navbar';
import { showAlert, showAlertSucces, showAlertConfirm, showAlertSwitch } from './alerts/alert';

export default class exchanges extends Component {
  state = {
    exchange: [],
    reader: {},
  };
  async componentDidMount() {
    const token = localStorage.getItem('token');
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `${token}`,
      },
    };
    const { data } = await myFetch(options, 'exchanges');
    const reader = await myFetch(options, 'readers');
    this.setState({
      exchange: data,
      reader: reader.data,
    });
  };

  handleDelete = (id) => {
    showAlertConfirm(id, this.handleClicDelete);
  };

  handleClicDelete = async (id) => {
      const token = localStorage.getItem('token');
      const options = {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `${token}`,
        },
      };
      const { ok, message } = await myFetch(options, `exchanges/${id}`);
      const { exchange } = this.state;
      this.setState({
        exchange: exchange.filter((i) => i.id !== id),
      });
      showAlert(ok, message);
  };

  handleSwitch = (ids) => {
    showAlertSwitch(ids, this.handleClicConfirme)
  }

  handleClicConfirme = async (id) => {
      const token = localStorage.getItem('token');
      const options = {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `${token}`,
        },
      };
      const { status, message } = await myFetch(options, `exchanges/${id}`);
      showAlertSucces(status, message);
  };

  render() {
    const { exchange, reader } = this.state;
    const list = exchange.map((item, index) => {
      let isDisabled = false;
      if (item.sender.id === reader.id && item.receiveDate === null) {
        isDisabled = true;
      };
      let disableReceiver = false;
      if (item.receiver.id === reader.id && item.receiveDate === null) {
        disableReceiver = true;
      };
      if (exchange.length > 0) {
        return (<div key={index} className='lists'>
          <div className='coverbook'>
            {item.bookExchanged.coverUrl !== 'coverbook' ? <img src={item.bookExchanged.coverUrl} className='img1' alt='CoverUrl' /> : <img src={coverbook} className='img1' alt='CoverUrl' />}
          </div>
          <li className='li-exchange'>
            <li>book: <strong>{item.bookExchanged.title}</strong></li>
            <li>sender: <strong>{item.sender.name}</strong></li>
            <li>received: <strong>{item.receiver.name}</strong></li>
          </li>
          <div>
            <li>sendDate: <strong>{item.sendDate}</strong></li>
            <li>receivedDate: <strong>{item.receiveDate}</strong></li>
          </div>
          <div className='div-button'>
            {isDisabled ? <button type='button' className='button-list' onClick={() => this.handleDelete(item.id)}><img src={excluir} alt='images' className='img' /></button> : null}
            {disableReceiver ? <button type='button' className='button-list' onClick={() => this.handleSwitch(item.id)}><img src={confirme} alt='images' className='img' /></button> : null}
          </div>
        </div>)
      }
      return null;
    });

    return (
      <div>
        <img src={biblioteca} className='img11' alt='CoverUrl' />
        <h1 className='skan'>SKAMBOOKS</h1>
        <Navbar />
        <h1 className='titles'>My exchanges</h1>
        <ol>
          {list}
        </ol>
      </div>
    );
  };
};
