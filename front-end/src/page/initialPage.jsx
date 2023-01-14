import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../App.css';
import { myFetch } from '../services/fetchs';

const MIN_LENGTH_INPUT = 8;
class initialPage extends Component {
  state = {
    email: '',
    password: '',
    buttonIsDisabled: true,
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    }, () => {
      const validEmail = /\S+@\S+\.\S+/;
      const { email, password } = this.state;
      const isDisabled = password.length < MIN_LENGTH_INPUT || !validEmail.test(email);
      this.setState({
        buttonIsDisabled: isDisabled,
      });
    });
  };

  handClick = async () => {
    const { email, password } = this.state;
    const update = {
      email: email,
      password: password,
    };

    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(update),
    };
    const response = await myFetch(options, 'login');
    const { status } = response;
    const { message, token } = await response.json();
    console.log(status, message, token);
    if (message) {
      alert(message);
    } if (token) {
      localStorage.setItem('token', token);
      const { history } = this.props;
      history.push('/skambooks');
    }
  };

  render() {
    const { buttonIsDisabled } = this.state;
    return (
      <div className='login'>
        <h1 className='title'>User Login</h1>
        <input type='text'
          placeholder='E-mail'
          name='email'
          onChange={this.handleChange}
          className='email' />
        <input type='text'
          placeholder='password'
          name='password'
          onChange={this.handleChange}
          className='password' />
        <Link to='/create-user' className='link'>Create user</Link>
        <button type='button'
          className='button' disabled={buttonIsDisabled} onClick={this.handClick}>login</button>
      </div>
    )
  }
};

/* const mapStateToProps = (state) => ({
  book: state.reducerFetch.books,
});
 */
export default initialPage;
