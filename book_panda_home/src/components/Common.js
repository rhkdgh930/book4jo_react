import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Common.css'; // CSS 파일 import

export const Wrapper = ({ children }) => (
  <div className="wrapper">{children}</div>
);

export const Title = ({ children }) => (
  <h1 className="title">{children}</h1>
);

export const Form = ({ children }) => (
  <form className="form">{children}</form>
);

export const Inputs = ({ children }) => (
  <div className="inputs">{children}</div>
);

export const Input = (props) => (
  <input className="input" {...props} />
);

export const Button = ({ children, onClick }) => (
  <button className="button" onClick={onClick}>{children}</button>
);

export const CustomLink = ({ to, children }) => (
  <Link className="custom-link" to={to}>{children}</Link>
);
