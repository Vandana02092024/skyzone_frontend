import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IsAgent, IsSuperAdmin, IsUser } from '../utils/Common';

export default function Sidebar() {
    const currentPath = window.location.pathname;

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [iconSide, setIconSide] = useState('right');
    const [icon, setIcon] = useState("bi bi-list");

    const toggleSidebar = () => {
        setIsSidebarOpen(prevState => !prevState);
    };


    useEffect(() => {
        const body = document.querySelector('body');
        if (isSidebarOpen) {
            body.classList.add('toggle-sidebar');
            setIconSide("right");
        } else {
            body.classList.remove('toggle-sidebar');
            setIconSide("left");
        }
    }, [isSidebarOpen]);

    const toggleIcon = () => {
        setIcon(`bi-arrow-${iconSide}-short`);
    }

    return (
    <section id="sidebar" className="sidebarFull">
        <ul id="sidebar-nav" className="sidebar-nav scroll h-100 pt-0">
            <div className="d-flex align-items-center mb-3">
                <Link className="navbar-brand  mx-auto">
                  <img style={{height: "50px"}} src={process.env.REACT_APP_LOGO} className="img-fluid" alt="logo" />
                </Link>
            </div>

            {IsAgent ?(
            <>
                <li className='fs-15 mt-30'><i className={`bi bi-patch-question ${(iconSide === 'right') && 'fs_40'}`}></i> {iconSide === 'right' ? '' : 'Queries'}</li>
                <li><hr className='horizontal' /></li>
                <li className="mb-2 nav-item">
                    <Link to="/customer-queries" className={`w-100 nav-link ${(currentPath === '/customer-queries' || currentPath === '/customer-queries') ? `active` : ''}`}>
                        <i className="bi bi-person-raised-hand"></i>
                        <span className="ms-2">Customer Queries</span>
                    </Link>
                </li>
                <li className="mb-2 nav-item">
                    <Link to="/general-queries" className={`w-100 nav-link ${(currentPath === '/general-queries' || currentPath === '/general-queries') ? `active` : ''}`}>
                        <i className="bi bi-question-circle-fill"></i>
                        <span className="ms-2">General Queries</span>
                    </Link>
                </li>
            </>
            ) :(
            <>
                <span className="toggle-sidebar-btn" onMouseOver={() => toggleIcon()} onMouseOut={() => setIcon("bi bi-list")} onClick={toggleSidebar} ><i className={icon}></i></span>
                <li className="mb-2 nav-item">
                    <Link to="/stripe" className={`w-100 nav-link ${(currentPath === '/stripe') ? `active` : ''}`}>
                        <i className="bi bi-plugin"></i>
                        <span className="ms-2">Stripe Integration</span>
                    </Link>
                </li>
                <li className="mb-2 nav-item">
                    <Link to="/payments" className={`w-100 nav-link ${(currentPath === '/payments') ? `active` : ''}`}>
                        <i className="bi bi-credit-card-fill"></i>
                        <span className="ms-2">Payments</span>
                    </Link>
                </li>
                <li className="mb-2 nav-item">
                    <Link to="/rewards" className={`w-100 nav-link ${(currentPath === '/rewards' || currentPath === '/add-reward-rule') ? `active` : ''}`}>
                        <i className="bi bi-trophy-fill"></i>
                        <span className="ms-2">Rewards</span>
                    </Link>
                </li>
                <li className="mb-2 nav-item">
                    <Link to="/latest-offerings" className={`w-100 nav-link ${(currentPath === '/add-offer' || currentPath === '/latest-offerings' || currentPath === '/update-offer') ? `active` : ''}`}>
                        <i className="bi bi-gift-fill"></i>
                        <span className="ms-2">Latest Offerings</span>
                    </Link>
                </li>
                <li className="mb-2 nav-item">
                    <Link to="/addons" className={`w-100 nav-link ${(currentPath === '/addons' || currentPath === '/create-addons') ? `active` : ''}`}>
                        <i className="bi bi-bag-plus-fill"></i>
                        <span className="ms-2">Addons</span>
                    </Link>
                </li>
            
            
            {!IsUser &&
            <>
            <li className="mb-2 nav-item">
                    <Link to="/push-notifications" className={`w-100 nav-link ${(currentPath === '/edit-notification' || currentPath === '/push-notifications' || currentPath === '/add-notification') ? `active` : ''}`}>
                        <i className="bi bi-bell-fill"></i>
                        <span className="ms-2">Push Notifications</span>
                    </Link>
                </li>
            </>
            }
            

            <li className='fs-15 mt-30'><i className={`bi bi-sliders ${(iconSide === 'right') && 'fs_40'}`}></i> {iconSide === 'right' ? '' : 'App Settings'}</li>
            <li><hr className='horizontal' /></li>
            <li className="mb-2 nav-item">
                <Link to="/menu-items" className={`w-100 nav-link ${(currentPath === '/menu-items' || currentPath === '/add-menu-items') ? `active` : ''}`}>
                    <i className="bi bi-ui-checks"></i>
                    <span className="ms-2">Kitchen Menu Items</span>
                </Link>
            </li>
            <li className="mb-2 nav-item">
                <Link to="/menu-slider" className={`w-100 nav-link ${(currentPath === '/menu-slider') ? `active` : ''}`}>
                    <i className="bi bi-person-badge-fill"></i>
                    <span className="ms-2">Kitchen Menu Slider</span>
                </Link>
            </li>
            <li className="mb-2 nav-item">
                <Link to="/mobile-available-products" className={`w-100 nav-link ${(currentPath === '/mobile-available-products') ? `active` : ''}`}>
                    <i className="bi bi-cart-check-fill"></i>
                    <span className="ms-2">App Visible Products</span>
                </Link>
            </li>
            <li className="mb-2 nav-item">
                <Link to="/location-manager-setup" className={`w-100 nav-link ${(currentPath === '/location-manager-setup') ? `active` : ''}`}>
                    <i className="bi bi-person-badge-fill"></i>
                    <span className="ms-2">Location Manager</span>
                </Link>
            </li>

            {!IsUser &&
                <>
                    <li className='fs-15 mt-30'><i className={`bi bi-gear ${(iconSide === 'right') && 'fs_40'}`}></i> {iconSide === 'right' ? '' : 'Settings'}</li>
                    <li><hr className='horizontal' /></li>
                    <li className="mb-2 nav-item">
                        <Link to="/users" className={`w-100 nav-link ${(currentPath === '/users' || currentPath === '/add-user') ? `active` : ''}`}>
                            <i className="bi bi-people-fill"></i>
                            <span className="ms-2">User Managment</span>
                        </Link>
                    </li>
                    <li className="mb-2 nav-item">
                        <Link to="/location-setup" className={`w-100 nav-link ${(currentPath === '/location-setup' || currentPath === '/add-location') ? `active` : ''}`}>
                            <i className="bi bi-geo-fill"></i>
                            <span className="ms-2">Locations Setup</span>
                        </Link>
                    </li>
                    <li className="mb-2 nav-item">
                        <Link to="/holiday-calendar" className={`w-100 nav-link ${(currentPath === '/holiday-calendar' || currentPath === '/add-location') ? `active` : ''}`}>
                            <i className="bi bi-calendar2-week-fill"></i>
                            <span className="ms-2">Holiday Calendar</span>
                        </Link>
                    </li>
                </>
            }

            {IsSuperAdmin &&
            <>
                <li className='fs-15 mt-30'><i className={`bi bi-cash-coin ${(iconSide === 'right') && 'fs_40'}`}></i> {iconSide === 'right' ? '' : 'Cost Optimization'}</li>
                <li><hr className='horizontal' /></li>
                <li className="mb-2 nav-item">
                    <Link to="/scheduling" className={`w-100 nav-link ${(currentPath === '/scheduling' || currentPath === '/add-scheduling') ? `active` : ''}`}>
                        <i className="bi bi-ui-checks"></i>
                        <span className="ms-2">Scheduling</span>
                    </Link>
                </li>
            </>
            }
            </>
            )}
        </ul>
    </section>
  )
}
