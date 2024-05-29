import React, { useState } from 'react';
import './Modal.css';
import axiosInstance from '../axiosInstance';

const Modal = ({ show, handleClose }) => {
    const [className, setName] = useState("");

    const createClass = async (e) => {
        e.preventDefault();
        try{
            console.log(className);
            await axiosInstance.post("/createClass", {className})
        }catch(error){
            console.log("error al crear clase");
        }
    }


  return (
    <div className={`modal-container ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} aria-labelledby="exampleModalLabel" aria-hidden={!show}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">Add a new Class</h5>
            <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={createClass}>
              <div className="mb-3">
                <label className="col-form-label">Name:</label>
                <input type="text" className="form-control" value={className} onChange={(e) => setName(e.target.value)}/>
              </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                    <button type="submit" className="btn btn-primary">Confirm</button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
