import React, { useState, useEffect } from "react";
import './customer.css';
import { useTranslation } from "react-i18next";
import { getCustomers } from "../../services/apiService";

const Customer = () => {
    const { t } = useTranslation();
    const [customersLog, setCustomersLog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                const data = await getCustomers();
                setCustomersLog(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching customers:", err);
                setError("Failed to load customers. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const filteredCustomers = 
        filter === 'All' ? customersLog : customersLog.filter((c) => c.action === filter);

    if (loading) return <div className="container py-4"><div className="alert alert-info">Loading customers...</div></div>;
    if (error) return <div className="container py-4"><div className="alert alert-danger">{error}</div></div>;

    return(
        <>
            <div className="container py-4">
                <h3>{t("customers_log")}</h3>

                <div className="btn-group mb-3 mt-3" role="group">
                    <button className={`btn btn-outline-primary ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter("All")}>{t("all")}</button>
                    <button className={`btn btn-outline-secondary ${filter === 'Read' ? 'active' : ''}`} onClick={() => setFilter("Read")}>{t("read")}</button>
                    <button className={`btn btn-outline-success ${filter === 'Buy' ? 'active' : ''}`} onClick={() => setFilter("Buy")}>{t("purchases")}</button>
                    <button className={`btn btn-outline-warning ${filter === 'Borrow' ? 'active' : ''}`} onClick={() => setFilter("Borrow")}>{t("borrowing")}</button>
                </div>

                {filteredCustomers.length === 0 ? (
                    <div className="alert alert-warning"> {t("no_records")} </div>
                ) : (
                    <ul className="list-group">
                        {filteredCustomers.map((cust) => (
                            <li key={cust.id} className="list-group-item">
                                <strong>{cust.name || cust.fullName}</strong> - <em>{cust.action}</em> "<strong>{cust.bookTitle}</strong>"
                            </li>
                        ))}
                    </ul>
                )}

                <hr className="my-4" />
                <div className="alert alert-info">
                    {t("total_transactions")} <strong>{customersLog.length}</strong>
                </div>
            </div>
        </>
    );
};

export default Customer;