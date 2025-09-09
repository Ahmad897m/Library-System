import React, { useState, useEffect } from "react";
import './header.css'
import { Container, Navbar, Form, FormControl, Dropdown, ListGroup, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useAppSelector } from '../../redux/hooks';
import { selectBooks } from '../../redux/slices/bookSlice';
import { useNavigate } from 'react-router-dom';

const Header = ({ onLogout }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const isArabic = i18n.language === 'ar';
    const books = useAppSelector(selectBooks);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    // البحث في الكتب
    const handleSearch = (term) => {
        if (!term.trim()) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        const results = books.filter(
            (book) =>
                book.title?.toLowerCase().includes(term.toLowerCase()) ||
                book.author?.toLowerCase().includes(term.toLowerCase()) ||
                book.category?.toLowerCase().includes(term.toLowerCase()) ||
                book.isbn?.includes(term)
        ).slice(0, 4); // لا يزيد عن 4 نتائج

        setSearchResults(results);
        setShowResults(results.length > 0);
    };

    // البحث عند تغيير النص
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(searchTerm);
        }, 300); // تأخير 300ms للبحث

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // إخفاء النتائج عند النقر خارجها
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.search-container')) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // الذهاب إلى صفحة الكتاب
    const handleBookSelect = (book) => {
        setSearchTerm("");
        setShowResults(false);
        navigate("/BookManagement");
    };

    // الذهاب إلى صفحة البحث
    const handleViewAllResults = () => {
        navigate("/BookManagement");
        setSearchTerm("");
        setShowResults(false);
    };

    // تسجيل الخروج
    const handleLogout = () => {
        if (window.confirm(t("confirmLogout"))) {
            onLogout();
        }
    };

    return (
        <>
        <Navbar bg="light" expand="lg" className="shadow-sm" style={{ height: '70px', 
            direction: isArabic ? 'rtl' : 'ltr',
            textAlign: isArabic ? 'right' : 'left' }}>
            <Container fluid>
                <Navbar.Brand href="/dashboard" className="fw-bold" style={{fontSize: "2rem", fontFamily: "Playfair Display"}}>
                    {t("libraryManagement")}
                </Navbar.Brand>

                <div className="search-container position-relative ms-auto me-3" style={{ maxWidth: '400px', width: '100%' }}>
                    <Form className="d-flex">
                        <FormControl
                            type="search"
                            placeholder={t("searchBooks")}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => searchTerm && handleSearch(searchTerm)}
                            className="me-2"
                            aria-label="Search"
                        />
                    </Form>

                    {/* نتائج البحث */}
                    {showResults && (
                        <div className="search-results-dropdown position-absolute top-100 start-0 end-0 mt-1 z-3">
                            <ListGroup className="shadow-lg border-0">
                                {searchResults.map((book) => (
                                    <ListGroup.Item
                                        key={book.id}
                                        action
                                        onClick={() => handleBookSelect(book)}
                                        className="search-result-item border-0"
                                    >
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1 text-primary">{book.title}</h6>
                                                <small className="text-muted">
                                                    {t("by")} {book.author}
                                                </small>
                                                <br />
                                                <small className="text-secondary">
                                                    {t("category")}: {book.category}
                                                </small>
                                            </div>
                                            <div className="text-end ms-2">
                                                <small className={`status-badge ${book.status}`}>
                                                    {t(book.status)}
                                                </small>
                                                <br />
                                                <small className="text-info">
                                                    {t("copies")}: {book.copies}
                                                </small>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                                
                                {searchResults.length > 0 && (
                                    <ListGroup.Item
                                        action
                                        onClick={handleViewAllResults}
                                        className="border-0 text-center bg-light fw-bold"
                                    >
                                        {t("viewAllResults")} →
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </div>
                    )}
                </div>

                {/* زر تسجيل الخروج */}
                <Button 
                    variant="outline-danger" 
                    onClick={handleLogout}
                    className="logout-btn"
                    style={{ marginLeft: '10px' , width: "20%", marginBottom: "20px" }}
                >
                 {t("logout")}
                </Button>
            </Container>
        </Navbar>
        </>
    );
}

export default Header;