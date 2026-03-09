import React, { Fragment, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import SelectResident from "../../components/modals/SelectResident";
import ProtectedRoute from "../protected/ProtectedRoute";
import { Accordion, Modal } from 'react-bootstrap';


const Sidenav = () => {
  const resident = useSelector((state) => state.resident.selectedResident);
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();
  const [showResident, setShowResident] = useState(false);

  const SIDENAV_WIDTH = 250;

  // ✅ THIS FIXES THE ALIGNMENT ISSUE
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.marginLeft = SIDENAV_WIDTH + "px";

    return () => {
      document.body.style.marginLeft = "0px";
    };
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };
  const isActive = (path) => location.pathname.startsWith(path);

  const MenuSection = ({ title, id, icon, children }) => (
    <li>
      <div
        className={`menu-toggle ${openMenu === id ? "active-section" : ""}`}
        onClick={() => toggleMenu(id)}
      >
        <span className="menu-title">
          {icon}
          {title}
        </span>
        <span className={openMenu === id ? "chevron open" : "chevron"}>
          ▾
        </span>
      </div>
      <div className={openMenu === id ? "submenu open" : "submenu"}>
        {children}
      </div>
    </li>
  );

  return (
    <Fragment>
      <div className="modern-sidenav">
        {/* Header */}
        <div className="sidenav-header">
          {JSON.stringify(resident) !== "{}" && (
            <Link to="/resident/detail" className="resident-name">
              {resident.first_name} {resident.last_name}
            </Link>
          )}
          <button
            className="choose-resident-btn"
            onClick={() => setShowResident(true)}
          >
            Choose Resident
          </button>
        </div>

        <ul className="sidenav-menu">
          <ProtectedRoute perm="view_reminder">
            <MenuSection title="Diary" id="diary">
              <Link to="/">Diary</Link>
              <Link to="/rota">Rota</Link>
            </MenuSection>
          </ProtectedRoute>

          <ProtectedRoute perm="view_home">
            <MenuSection title="Home" id="home">
              <Link to="/home/add-home">Add Home</Link>
              <Link to="/home">Home List</Link>
            </MenuSection>
          </ProtectedRoute>

          <ProtectedRoute perm="view_user">
            <MenuSection title="Staff" id="staff">
              <Link to="/staff/add-staff">Add Staff</Link>
              <Link to="/staff">Staff List</Link>
            </MenuSection>
          </ProtectedRoute>

          <ProtectedRoute perm="view_resident">
            <MenuSection title="Resident" id="resident">
              <Link to="/resdient/add-resdient">Add Resident</Link>
              <Link to="/resident">Resident List</Link>
              <Link to="/resident/discharged-resident">
                Discharged Residents
              </Link>
            </MenuSection>
          </ProtectedRoute>

          <ProtectedRoute perm="view_resident">
            <MenuSection title="Handover" id="handover">
              <Link to="/handover">Handover</Link>
              <Link to="/note/deleted-notes">Deleted Notes</Link>
            </MenuSection>
          </ProtectedRoute>

          <ProtectedRoute perm="view_appointment">
            <MenuSection title="Appointment" id="appointment">
              <Link to="/appointment/add-appointment">
                Add Appointment
              </Link>
              <Link to="/appointment">Appointment List</Link>
            </MenuSection>
          </ProtectedRoute>

          <ProtectedRoute perm="view_finance">
            <MenuSection title="Finances" id="finance">
              <Link to="/payment/add-payment">Add Transactions</Link>
              <Link to="/payment">Transactions</Link>
            </MenuSection>
          </ProtectedRoute>

          <MenuSection title="House" id="house">
            <Link to="/house-overview">House Overview</Link>
            <Link to="/house-asset">House Assets</Link>
            <Link to="/house-stock">House Stock</Link>
            <Link to="/repair-record">
              House Repairs and Damages
            </Link>
          </MenuSection>

          <ProtectedRoute perm="view_assessment">
            <MenuSection title="Assessments" id="assessment">
              <Link to="/assessment">Assessments</Link>
              <Link to="/evaluation/add-evaluation">
                Start Evaluation
              </Link>
              <Link to="/evaluation">Evaluations</Link>
            </MenuSection>
          </ProtectedRoute>

          <ProtectedRoute perm="view_supportplan">
            <MenuSection title="Support Plan" id="support">
              <Link to="/supportplan">Support Plans</Link>
              <Link to="/supportplan/add-supportplan">
                Start Assessment
              </Link>
            </MenuSection>
          </ProtectedRoute>

          <ProtectedRoute perm="view_riskactionplan">
            <MenuSection title="Risk Assessment" id="risk">
              <Link to="/riskassessment">Risk Assessment</Link>
              <Link to="/riskassessment/add-riskassessment">
                Start Risk Assessment
              </Link>
            </MenuSection>
          </ProtectedRoute>

          <ProtectedRoute perm="view_attachments">
            <MenuSection title="Attachments" id="attachments">
              <Link to="/attacthment/upload">Upload</Link>
              <Link to="/attacthment">Attachments</Link>
            </MenuSection>
          </ProtectedRoute>

          <ProtectedRoute perm="view_suggestioncomplains">
            <MenuSection title="Accident & Incidents" id="incident">
              <Link to="/suggesion/add-suggestion">Add</Link>
              <Link to="/suggesion">List</Link>
            </MenuSection>
          </ProtectedRoute>

          <ProtectedRoute perm="view_bodymap">
            <MenuSection title="Body Map" id="bodymap">
              <Link to="/body-map">Body Maps</Link>
              <Link to="/body-map/add">Add Body Map</Link>
            </MenuSection>
          </ProtectedRoute>

          <ProtectedRoute perm="view_confidentialrecord">
            <MenuSection title="Admin Panel" id="admin">
              <Link to="/confidential-info">
                Add Confidential Record
              </Link>
              <Link to="/confidential-list">
                Confidential List
              </Link>
            </MenuSection>
          </ProtectedRoute>
        </ul>
      </div>

      <Modal
        show={showResident}
        onHide={() => setShowResident(false)}
        centered
        className="ms-modal-dialog-width ms-modal-content-width"
      >
        <Modal.Header className="ms-modal-header-radius-0">
          <h4 className="modal-title text-white">Choose Resident</h4>
          <button className="close text-white" onClick={() => setShowResident(false)}>x</button>
        </Modal.Header>
        <Modal.Body className="p-0 text-left">
          <SelectResident handleClose={() => setShowResident(false)} />
        </Modal.Body>
      </Modal>

      <style>{`
      
        html, body {
          margin: 0 !important;
          padding: 0 !important;
        }
        
        #root {
          margin: 0 !important;
          padding: 0 !important;
        }
        .modern-sidenav {
          position: fixed; /* ✅ CRITICAL FIX */
          top: 0;
          left: 0;
          width: ${SIDENAV_WIDTH}px;
          height: 100vh;
          background: rgba(128,250,181,0.08);
          color: white;
          padding-top: 20px;
          font-family: Arial, sans-serif;
          overflow-y: auto;
          z-index: 500;
        }

        .sidenav-header {
          padding: 0 20px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .resident-name {
          display: block;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 10px;
          color: black;
          text-decoration: none;
        }

        .choose-resident-btn {
          width: 100%;
          padding: 8px;
          background: #2563eb;
          border: none;
          color: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .sidenav-menu {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .menu-toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          font-size: 18px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .menu-toggle:hover {
          background: rgba(29,237,227,0.08);
        }

        .chevron {
          transition: transform 0.3s ease;
        }

        .chevron.open {
          transform: rotate(180deg);
        }

        .submenu {
          max-height: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: max-height 0.3s ease;
        }

        .submenu.open {
          max-height: 400px;
        }

        .submenu a {
          padding: 8px 40px;
          font-size: 14px;
          color: #000000;
          text-decoration: none;
        }

        .submenu a:hover {
          background: rgba(0,0,0,0.08);
          color: white;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(255,255,255,0.6);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal-box {
          width: 500px;
          background: white;
          border-radius: 8px;
          overflow: hidden;
        }

        .modal-header {
          padding: 12px 20px;
          background: #b8f2d5;
          color: white;
          display: flex;
          justify-content: space-between;
        }
      `}</style>
    </Fragment>
  );
};

export default Sidenav;