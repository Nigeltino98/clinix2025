import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getApi } from './api/api';
import { Helmet } from 'react-helmet-async'; // Added for page titles if needed

// Redux Actions
import { homeActions } from './store/home';
import { staffActions } from './store/staff';
import { authActions } from './store/auth';
import { residentActions } from './store/resident';
import { appointmentActions } from './store/appointment';
import { attachmentActions } from './store/attachment';
import { notificationActions } from './store/notification';
import { inventoryActions } from './store/inventory';
import { userHistoryActions } from './store/userHistory';
import { houseAssetActions } from './store/assets';
import { stockActions } from './store/stock';
import { repairActions } from './store/repairs';
import { confidentialActions } from './store/confidential';
import { noteActions } from './store/note';

// Pages / Components
import WelcomePage from './components/pages/WelcomePage';

import Preloader from "./components/layouts/Preloader";

const Home = React.lazy(() => import("./components/pages/Home"));
const Rota = React.lazy(() => import("./components/pages/rota/Rota"));
const Addappointment = React.lazy(() => import("./components/pages/appointment/Addappointment"));
const Appointmentlist = React.lazy(() => import("./components/pages/appointment/Appointmentlist"));
// bed manager
const Addbed = React.lazy(() => import("./components/pages/bed-manager/Addbed"));
const Bedlist = React.lazy(() => import("./components/pages/bed-manager/Bedlist"));
// department
const Adddepartment = React.lazy(() => import("./components/pages/department/Adddepartment"));
const Departmentlist = React.lazy(() => import("./components/pages/department/Departmentlist"));
// doctor
const Adddoctor = React.lazy(() => import("./components/pages/doctor/Adddoctor"));
const EditProfile = React.lazy(() => import("./components/pages/doctor/EditProfile"));

const Doctorlist = React.lazy(() => import("./components/pages/doctor/Doctorlist"));
// doctor schedule
const Schedulelist = React.lazy(() => import("./components/pages/doctor-schedule/Schedulelist"));
// employee
const Addemployee = React.lazy(() => import("./components/pages/human-resource/Addemployee"));

const AddAssesment = React.lazy(() => import("./components/pages/human-resource/AddAssesment"));
const Addevaluation = React.lazy(() => import("./components/pages/human-resource/AddEvaluation"));
const PossibleAnswer = React.lazy(() => import("./components/pages/human-resource/PossibleAnswer"));
const Employeelist = React.lazy(() => import("./components/pages/human-resource/Employeelist"));
const SupportPlan = React.lazy(() => import("./components/pages/human-resource/SupportPlan"));
const RiskList = React.lazy(() => import("./components/pages/human-resource/Risk"));
const Notifications = React.lazy(() => import("./components/pages/human-resource/Notifications"));
const AddRisk = React.lazy(() => import("./components/pages/payment/AddRisk"));
const AddPlan = React.lazy(() => import("./components/pages/payment/AddPlan"));
const AddPlanEvaluation = React.lazy(() => import("./components/sections/payment/addpayment/AddPlanEvaluation"));

// notice
const Addnotice = React.lazy(() => import("./components/pages/notice/Addnotice"));
const Noticelist = React.lazy(() => import("./components/pages/notice/Noticelist"));
// patient
const Addpatient = React.lazy(() => import("./components/pages/patient/Addpatient"));
const Patientlist = React.lazy(() => import("./components/pages/patient/Patientlist"));
const Dischargedpatient = React.lazy(() => import("./components/pages/patient/Dischargedpatient"));
const DailyNote = React.lazy(() => import("./components/modals/DailyNote"));
const Patientreport = React.lazy(() => import("./components/pages/reports/Patientreport"));
const Addpayment = React.lazy(() => import("./components/pages/payment/Addpayment"));
const Paymentlist = React.lazy(() => import("./components/pages/payment/Paymentlist"));
const Lockscreen = React.lazy(() => import("./components/pages/prebuilt-pages/Lockscreen"));
const Error = React.lazy(() => import("./components/pages/prebuilt-pages/Error"));
const Defaultlogin = React.lazy(() => import("./components/pages/prebuilt-pages/Defaultlogin"));
const Defaultregister = React.lazy(() => import("./components/pages/prebuilt-pages/Defaultregister"));
const DefaultregisterEmail = React.lazy(() => import("./components/pages/prebuilt-pages/DefaultregisterEmail"));

const Faq = React.lazy(() => import("./components/pages/prebuilt-pages/Faq"));

const Userprofile = React.lazy(() => import("./components/pages/prebuilt-pages/Userprofile"));
// reports

// note
const DeletedNote = React.lazy(() => import("./components/pages/notes/DeletedNote"));

const DrawingApp = React.lazy(() => import("./components/pages/Drawing"))
const Drawinglist = React.lazy(() => import("./components/pages/bed-manager/DrawingList"));
const AddInventory = React.lazy(() => import ("./components/modals/AddInventory"));
const EditInventory = React.lazy(() => import("./components/modals/EditInventory"));
const InventoryList = React.lazy (() => import("./components/pages/patient/InventoryList"));
const UserHistory = React.lazy (() => import("./components/modals/UserHistory"));
const DeleteUser = React.lazy (() => import("./components/modals/DeleteUser"));
const AddAssets = React.lazy (() => import("./components/modals/AddAssets"));
const AddStock = React.lazy (() => import("./components/modals/AddStock"));
const AssetList = React.lazy (() => import("./components/pages/assets_stock/Assetlist"));
const HouseOverview = React.lazy (() => import("./components/pages/house/house-overview"));

const StockList = React.lazy (() => import("./components/pages/assets_stock/StockList"));
const AddRepairs = React.lazy ( () => import("./components/modals/AddRepairs"));
const RepairList = React.lazy ( () => import("./components/pages/assets_stock/RepairList"));
const AddConfidential = React.lazy ( () => import("./components/modals/AddConfidential"));
const ConfidentialList = React.lazy ( () => import("./components/pages/confidential/ConfidentialList"));

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token)?.token;
  const isLoggedIn = useSelector((state) => state.auth.loggedin);

  useEffect(() => {
    if (!isLoggedIn) return;

    getApi(r => dispatch(homeActions.setHome(r.data)), token, "/api/home", () => dispatch(authActions.logout()));
    getApi(r => dispatch(staffActions.setStaff(r.data)), token, "/api/staff");
    getApi(r => dispatch(appointmentActions.setAppointments(r.data)), token, "/api/appointment");
    getApi(r => dispatch(attachmentActions.setAttachments(r.data)), token, "/api/attachment");
    getApi(r => dispatch(authActions.setUser(r.data)), token, "/api/me");
    getApi(r => dispatch(residentActions.setResidents(r.data)), token, "/api/resident");
    getApi(r => dispatch(notificationActions.setNotification(r.data)), token, "/api/reminder");
    getApi(r => dispatch(inventoryActions.setInventory(r.data)), token, "/api/inventory");
    getApi(r => dispatch(userHistoryActions.setUserHistory(r.data)), token, "/api/userHistory");
    getApi(r => dispatch(houseAssetActions.setHouseAsset(r.data)), token, "/api/house-asset");
    getApi(r => dispatch(stockActions.setStock(r.data)), token, "/api/house-stock");
    getApi(r => dispatch(repairActions.setRepair(r.data)), token, "/api/repair-record");
    getApi(r => dispatch(confidentialActions.setConfidential(r.data)), token, "/api/confidential-info");
    getApi(r => dispatch(noteActions.setNote(r.data)), token, "/api/note");
  }, [dispatch, token, isLoggedIn]);

  return (
    <Suspense fallback={<Preloader />}>
      <Helmet>
        <title>Clinix</title>
      </Helmet>

      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/rota" element={<Rota />} />

            <Route path="/appointment/add-appointment" element={<Addappointment />} />
            <Route path="/appointment" element={<Appointmentlist />} />

            <Route path="/staff/add-staff" element={<Adddoctor />} />
            <Route path="/staff" element={<Doctorlist />} />
            <Route path="/staff/edit-profile" element={<EditProfile />} />

            <Route path="/resident" element={<Patientlist />} />
            <Route path="/resdient/add-resdient" element={<Addpatient />} />
            <Route path="/resident/detail" element={<Userprofile />} />
            <Route path="/resident/discharged-resident" element={<Dischargedpatient />} />

            <Route path="/note/add-note" element={<DailyNote />} />
            <Route path="/note" element={<Patientreport />} />
            <Route path="/note/deleted-notes" element={<DeletedNote />} />

            {/* Evaluations */}
            <Route path="/evaluation/add-evaluation" element={<Addemployee />} />
            <Route path="/evaluation/deatil" element={<Faq />} />
            <Route path="/evaluation" element={<Addevaluation />} />

            {/* Attachments */}
            <Route path="/attacthment/upload" component={<Addbed />} />
            <Route path="/attacthment" component={<Bedlist />} />

             {/* Homes */}
            <Route path="/home/add-home" element={<Adddepartment />} />
            <Route path="/home/home-list" element={<Departmentlist />} />

            {/* Assessment */}
            <Route path="/assessment/detail" element={<Employeelist />} />
            <Route exact path="/assessment" element={<AddAssesment />} />
            <Route path="/assessment/possible-answer" element={<PossibleAnswer />} />

            {/* Support Plan */}
            <Route path="/supportplan/detail" element={<SupportPlan />} />
            <Route exact path="/supportplan" element={<SupportPlan />} />
            <Route path="/supportplan/add-supportplan" element={<AddPlan />} />
            <Route path="/supportplan/evaluations" element={<AddPlanEvaluation />} />

            {/* Risk Assessment */}
            <Route path="/riskassessment/detail" element={<Employeelist />} />
            <Route exact path="/riskassessment" element={<RiskList />} />
            <Route path="/riskassessment/add-riskassessment" element={<AddRisk />} />

            {/* Notes */}
            <Route path="/note/add-note" element={<DailyNote />} />
            <Route exact path="/note" element={<Patientreport />} />
            <Route path="/note/deleted-notes" element={<DeletedNote />} />

            {/* Finance */}
            <Route path="/payment/add-payment" element={<Addpayment />} />
            <Route exact path="/payment" element={<Paymentlist />} />
            <Route path="/notification" element={<Notifications />} />

              {/* Add Inventory */}
            <Route path="/resident/add-inventory" element={<AddInventory />}  />
            <Route exact path="resident" element={<Patientlist />}  />
            <Route path="/resident/edit-inventory" element={<EditInventory />}  />

            {/* EditInventory */}
            <Route path="/resident/edit-inventory" element={<EditInventory />}  />
            <Route exact path="resident" element={<Patientlist />} />

            {/* Inventory List */}
            <Route path="/resident/InventoryList" element={<InventoryList />} />
            <Route exact path="resident" element={<Patientlist />} />

            {/* UserHistory */}
            <Route path="/staff/UserHistory" element={<UserHistory />} />
            <Route exact path="staff" element={<Doctorlist />} />

            <Route path="/staff/delete-non-superusers" element={<DeleteUser />} />
            <Route exact path="staff" element={<Doctorlist />} />

            {/* HouseAssets */}
            <Route path="/house-asset" element={<AddAssets />} />
            <Route path="/asset-list"  element={<AssetList />} />

            {/* House overview */}
            <Route path="/house-overview" element={<HouseOverview />} />
            <Route path="/house-overview/asset-list"  element={<AssetList />} />
            <Route path="/house-overview/stock-list"  element={<StockList />} />
            <Route path="/house-overview/repair-list" element={<RepairList />} />

            {/* HouseStock */}
            <Route path="/house-stock" element={<AddStock />} />
            <Route path="/stock-list" element={<StockList />} />

            {/* House repairs */}
            <Route path="/repair-record" element={<AddRepairs />} />
            <Route path="/repair-list" element={<RepairList />} />

            {/* Confidential-info */}
            <Route path="/confidential-info" element={<AddConfidential />} />
            <Route path="/confidential-list" element={<ConfidentialList />} />

            <Route path="/payment" element={<Paymentlist />} />
            <Route path="/payment/add-payment" element={<Addpayment />} />

            <Route path="/suggesion/add-suggestion" element={<Addnotice />} />
            <Route exact path="/suggesion" element={<Noticelist />} />

            <Route exact path="/body-map" element={<Drawinglist />} />
            <Route path="/body-map/add" component={<DrawingApp />} />

            <Route path="/lock" element={<Lockscreen />} />
            <Route path="/error" element={<Error />} />
            <Route path="*" element={<Navigate to="/error" replace />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Defaultlogin />} />
            <Route path="/api/password_reset" element={<Defaultregister />} />
            <Route path="/password-reset-email" element={<DefaultregisterEmail />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </Suspense>
  );
};

export default App;
