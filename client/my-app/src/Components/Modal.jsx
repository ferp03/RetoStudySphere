import React, { useState } from 'react';
import './Modal.css'

const Modal = ({ show, handleClose }) => {
  return (
      <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} aria-labelledby="exampleModalLabel" aria-hidden={!show}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Add a new Class</h5>
            <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="recipient-name" className="col-form-label">Name:</label>
                <input type="text" className="form-control" id="recipient-name" />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
            <button type="button" className="btn btn-primary">Confirm</button>
          </div>
        </div>
      </div>
      </div>
  );
};

export default Modal;
