import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import './addNewCustomer.css';
import { addCustomer } from "../../services/apiService";

const AddNewCustomer = () => {
  const { t } = useTranslation();

  function generateMemberId() {
    return 'LIB-' + Math.floor(100000 + Math.random() * 900000);
  }

  function getTodayDate() {
    return new Date().toISOString().split('T')[0];
  }

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    memberId: generateMemberId(),
    joinDate: getTodayDate(),
  });

  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Add customer to the API
      await addCustomer(formData);
      
      // Show success message
      setSuccessMessage(true);
      setErrorMessage("");
      
      // Reset form after 4 seconds
      setTimeout(() => {
        setSuccessMessage(false);
        
        // Reset form data but generate new ID
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          address: '',
          dateOfBirth: '',
          memberId: generateMemberId(),
          joinDate: getTodayDate(),
        });
      }, 4000);
    } catch (error) {
      console.error("Error adding customer:", error);
      setErrorMessage("Failed to add customer. Please try again.");
      setSuccessMessage(false);
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  return (
    <div className="container mt-4">
      <h3>{t('addNewCustomer.title')}</h3>

      {successMessage && (
        <div className="alert alert-success mt-3" role="alert">
          ✅ {t('addNewCustomer.successMessage')}
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger mt-3" role="alert">
          ❌ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">{t('addNewCustomer.fullName')}</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">{t('addNewCustomer.email')}</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">{t('addNewCustomer.phone')}</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">{t('addNewCustomer.address')}</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">{t('addNewCustomer.dateOfBirth')}</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">{t('addNewCustomer.memberId')}</label>
          <input
            type="text"
            name="memberId"
            value={formData.memberId}
            readOnly
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">{t('addNewCustomer.joinDate')}</label>
          <input
            type="date"
            name="joinDate"
            value={formData.joinDate}
            readOnly
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary mt-5 add">
          {t('addNewCustomer.addCustomer')}
        </button>
      </form>
    </div>
  );
};

export default AddNewCustomer;