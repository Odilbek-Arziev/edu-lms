import {Navigate} from "react-router-dom";

//Dashboard
import DashboardAnalytics from "../pages/DashboardAnalytics";
import DashboardCrm from "../pages/DashboardCrm";
import DashboardEcommerce from "../pages/DashboardEcommerce";

import DashboardCrypto from "../pages/DashboardCrypto";
import DashboardProject from "../pages/DashboardProject";
import DashboardNFT from "../pages/DashboardNFT";

//Calendar
import Calendar from "../pages/Calendar";
import MonthGrid from "../pages/Calendar/monthGrid";

// Email box
import MailInbox from "../pages/EmailInbox";
import BasicAction from "../pages/Email/EmailTemplates/BasicAction";
import EcommerceAction from "../pages/Email/EmailTemplates/EcommerceAction";

//Chat
import Chat from "../pages/Chat";

// Project
import ProjectList from "../pages/Projects/ProjectList";
import ProjectOverview from "../pages/Projects/ProjectOverview";
import CreateProject from "../pages/Projects/CreateProject";

//Task
import TaskDetails from "../pages/Tasks/TaskDetails";
import TaskList from "../pages/Tasks/TaskList";

//Transactions
import Transactions from '../pages/Crypto/Transactions';
import BuySell from '../pages/Crypto/BuySell';
import CryproOrder from '../pages/Crypto/CryptoOrder';
import MyWallet from '../pages/Crypto/MyWallet';
import ICOList from '../pages/Crypto/ICOList';
import KYCVerification from '../pages/Crypto/KYCVerification';

//Crm Pages
import CrmCompanies from "../pages/Crm/CrmCompanies";
import CrmContacts from "../pages/Crm/CrmContacts";
import CrmDeals from "../pages/Crm/CrmDeals/index";
import CrmLeads from "../pages/Crm/CrmLeads/index";

//Invoices
import InvoiceList from "../pages/Invoices/InvoiceList";
import InvoiceCreate from "../pages/Invoices/InvoiceCreate";
import InvoiceDetails from "../pages/Invoices/InvoiceDetails";

// Support Tickets
import ListView from '../pages/SupportTickets/ListView';
import TicketsDetails from '../pages/SupportTickets/TicketsDetails';

// //Ecommerce Pages
import EcommerceProducts from "../pages/Ecommerce/EcommerceProducts/index";
import EcommerceProductDetail from "../pages/Ecommerce/EcommerceProducts/EcommerceProductDetail";
import EcommerceAddProduct from "../pages/Ecommerce/EcommerceProducts/EcommerceAddProduct";
import EcommerceOrders from "../pages/Ecommerce/EcommerceOrders/index";
import EcommerceOrderDetail from "../pages/Ecommerce/EcommerceOrders/EcommerceOrderDetail";
import EcommerceCustomers from "../pages/Ecommerce/EcommerceCustomers/index";
import EcommerceCart from "../pages/Ecommerce/EcommerceCart";
import EcommerceCheckout from "../pages/Ecommerce/EcommerceCheckout";
import EcommerceSellers from "../pages/Ecommerce/EcommerceSellers/index";
import EcommerceSellerDetail from "../pages/Ecommerce/EcommerceSellers/EcommerceSellerDetail";

// NFT Marketplace Pages
import Marketplace from "../pages/NFTMarketplace/Marketplace";
import Collections from "../pages/NFTMarketplace/Collections";
import CreateNFT from "../pages/NFTMarketplace/CreateNFT";
import Creators from "../pages/NFTMarketplace/Creators";
import ExploreNow from "../pages/NFTMarketplace/ExploreNow";
import ItemDetails from "../pages/NFTMarketplace/Itemdetails";
import LiveAuction from "../pages/NFTMarketplace/LiveAuction";
import Ranking from "../pages/NFTMarketplace/Ranking";
import WalletConnect from "../pages/NFTMarketplace/WalletConnect";

// Base Ui
import UiAlerts from "../pages/BaseUi/UiAlerts/UiAlerts";
import UiBadges from "../pages/BaseUi/UiBadges/UiBadges";
import UiButtons from "../pages/BaseUi/UiButtons/UiButtons";
import UiColors from "../pages/BaseUi/UiColors/UiColors";
import UiCards from "../pages/BaseUi/UiCards/UiCards";
import UiCarousel from "../pages/BaseUi/UiCarousel/UiCarousel";
import UiDropdowns from "../pages/BaseUi/UiDropdowns/UiDropdowns";
import UiGrid from "../pages/BaseUi/UiGrid/UiGrid";
import UiImages from "../pages/BaseUi/UiImages/UiImages";
import UiTabs from "../pages/BaseUi/UiTabs/UiTabs";
import UiAccordions from "../pages/BaseUi/UiAccordion&Collapse/UiAccordion&Collapse";
import UiModals from "../pages/BaseUi/UiModals/UiModals";
import UiOffcanvas from "../pages/BaseUi/UiOffcanvas/UiOffcanvas";
import UiPlaceholders from "../pages/BaseUi/UiPlaceholders/UiPlaceholders";
import UiProgress from "../pages/BaseUi/UiProgress/UiProgress";
import UiNotifications from "../pages/BaseUi/UiNotifications/UiNotifications";
import UiMediaobject from "../pages/BaseUi/UiMediaobject/UiMediaobject";
import UiEmbedVideo from "../pages/BaseUi/UiEmbedVideo/UiEmbedVideo";
import UiTypography from "../pages/BaseUi/UiTypography/UiTypography";
import UiList from "../pages/BaseUi/UiLists/UiLists";
import UiGeneral from "../pages/BaseUi/UiGeneral/UiGeneral";
import UiRibbons from "../pages/BaseUi/UiRibbons/UiRibbons";
import UiUtilities from "../pages/BaseUi/UiUtilities/UiUtilities";

// Advance Ui
import UiScrollbar from "../pages/AdvanceUi/UiScrollbar/UiScrollbar";
import UiAnimation from "../pages/AdvanceUi/UiAnimation/UiAnimation";
import UiSwiperSlider from "../pages/AdvanceUi/UiSwiperSlider/UiSwiperSlider";
import UiRatings from "../pages/AdvanceUi/UiRatings/UiRatings";
import UiHighlight from "../pages/AdvanceUi/UiHighlight/UiHighlight";

// Widgets
import Widgets from '../pages/Widgets/Index';

//Forms
import BasicElements from "../pages/Forms/BasicElements/BasicElements";
import FormSelect from "../pages/Forms/FormSelect/FormSelect";
import FormEditor from "../pages/Forms/FormEditor/FormEditor";
import CheckBoxAndRadio from "../pages/Forms/CheckboxAndRadio/CheckBoxAndRadio";
import Masks from "../pages/Forms/Masks/Masks";
import FileUpload from "../pages/Forms/FileUpload/FileUpload";
import FormPickers from "../pages/Forms/FormPickers/FormPickers";
import FormRangeSlider from "../pages/Forms/FormRangeSlider/FormRangeSlider";
import Formlayouts from "../pages/Forms/FormLayouts/Formlayouts";
import FormValidation from "../pages/Forms/FormValidation/FormValidation";
import FormWizard from "../pages/Forms/FormWizard/FormWizard";
import FormAdvanced from "../pages/Forms/FormAdvanced/FormAdvanced";
import Select2 from "../pages/Forms/Select2/Select2";

//Tables
import BasicTables from '../pages/Tables/BasicTables/BasicTables';
import ReactTable from "../pages/Tables/ReactTables";

//Icon pages
import RemixIcons from "../pages/Icons/RemixIcons/RemixIcons";
import BoxIcons from "../pages/Icons/BoxIcons/BoxIcons";
import MaterialDesign from "../pages/Icons/MaterialDesign/MaterialDesign";
import FeatherIcons from "../pages/Icons/FeatherIcons/FeatherIcons";
import LineAwesomeIcons from "../pages/Icons/LineAwesomeIcons/LineAwesomeIcons";
import CryptoIcons from "../pages/Icons/CryptoIcons/CryptoIcons";

//Maps
import GoogleMaps from "../pages/Maps/GoogleMaps/GoogleMaps";

//AuthenticationInner pages
import BasicSignIn from '../pages/AuthenticationInner/Login/BasicSignIn';
import CoverSignIn from '../pages/AuthenticationInner/Login/CoverSignIn';
import BasicSignUp from '../pages/AuthenticationInner/Register/BasicSignUp';
import CoverSignUp from "../pages/AuthenticationInner/Register/CoverSignUp";
import BasicPasswReset from '../pages/AuthenticationInner/PasswordReset/BasicPasswReset';
//pages
import Starter from '../pages/Pages/Starter/Starter';
import SimplePage from '../pages/Pages/Profile/SimplePage/SimplePage';
import Settings from '../pages/Pages/Profile/Settings/Settings';
import Team from '../pages/Pages/Team/Team';
import Timeline from '../pages/Pages/Timeline/Timeline';
import Faqs from '../pages/Pages/Faqs/Faqs';
import Pricing from '../pages/Pages/Pricing/Pricing';
import Gallery from '../pages/Pages/Gallery/Gallery';
import Maintenance from '../pages/Pages/Maintenance/Maintenance';
import ComingSoon from '../pages/Pages/ComingSoon/ComingSoon';
import SiteMap from '../pages/Pages/SiteMap/SiteMap';
import SearchResults from '../pages/Pages/SearchResults/SearchResults';
import PrivecyPolicy from '../pages/Pages/PrivancyPolicy'
import TermsCondition from '../pages/Pages/TermAndConditions'

import CoverPasswReset from '../pages/AuthenticationInner/PasswordReset/CoverPasswReset';
import BasicLockScreen from '../pages/AuthenticationInner/LockScreen/BasicLockScr';
import CoverLockScreen from '../pages/AuthenticationInner/LockScreen/CoverLockScr';
import BasicLogout from '../pages/AuthenticationInner/Logout/BasicLogout';
import CoverLogout from '../pages/AuthenticationInner/Logout/CoverLogout';
import BasicSuccessMsg from '../pages/AuthenticationInner/SuccessMessage/BasicSuccessMsg';
import CoverSuccessMsg from '../pages/AuthenticationInner/SuccessMessage/CoverSuccessMsg';
import BasicTwosVerify from '../pages/AuthenticationInner/TwoStepVerification/BasicTwosVerify';
import CoverTwosVerify from '../pages/AuthenticationInner/TwoStepVerification/CoverTwosVerify';
import Basic404 from '../pages/AuthenticationInner/Errors/Basic404';
import Cover404 from '../pages/AuthenticationInner/Errors/Cover404';
import Alt404 from '../pages/AuthenticationInner/Errors/Alt404';
import Error500 from '../pages/AuthenticationInner/Errors/Error500';

import BasicPasswCreate from "../pages/AuthenticationInner/PasswordCreate/BasicPasswCreate";
import CoverPasswCreate from "../pages/AuthenticationInner/PasswordCreate/CoverPasswCreate";
import Offlinepage from "../pages/AuthenticationInner/Errors/Offlinepage";

//login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";

//Charts
import LineCharts from "../pages/Charts/ApexCharts/LineCharts";
import AreaCharts from "../pages/Charts/ApexCharts/AreaCharts";
import ColumnCharts from "../pages/Charts/ApexCharts/ColumnCharts";
import BarCharts from "../pages/Charts/ApexCharts/BarCharts";
import MixedCharts from "../pages/Charts/ApexCharts/MixedCharts";
import TimelineCharts from "../pages/Charts/ApexCharts/TimelineCharts";
import CandlestickChart from "../pages/Charts/ApexCharts/CandlestickChart";
import BoxplotCharts from "../pages/Charts/ApexCharts/BoxplotCharts";
import BubbleChart from "../pages/Charts/ApexCharts/BubbleChart";
import ScatterCharts from "../pages/Charts/ApexCharts/ScatterCharts";
import HeatmapCharts from "../pages/Charts/ApexCharts/HeatmapCharts";
import TreemapCharts from "../pages/Charts/ApexCharts/TreemapCharts";
import PieCharts from "../pages/Charts/ApexCharts/PieCharts";
import RadialbarCharts from "../pages/Charts/ApexCharts/RadialbarCharts";
import RadarCharts from "../pages/Charts/ApexCharts/RadarCharts";
import PolarCharts from "../pages/Charts/ApexCharts/PolarCharts";

import ChartsJs from "../pages/Charts/ChartsJs/index";
import Echarts from "../pages/Charts/ECharts/index";

//Job pages
import Statistics from "../pages/Jobs/Statistics";
import JobList from "../pages/Jobs/JobList/List";
import JobGrid from "../pages/Jobs/JobList/Grid";
import JobOverview from "../pages/Jobs/JobList/Overview";
import CandidateList from "../pages/Jobs/CandidateList/ListView";
import CandidateGrid from "../pages/Jobs/CandidateList/GridView";
import NewJobs from "../pages/Jobs/NewJob";
import JobCategories from "../pages/Jobs/JobCategories";
import Application from "../pages/Jobs/Application";
import CompaniesList from "../pages/Jobs/CompaniesList";

import ApiKey from '../pages/APIKey/index'

// Landing Index
import OnePage from "../pages/Landing/OnePage";
import NFTLanding from "../pages/Landing/NFTLanding";
import JobLanding from '../pages/Job_Landing'

// User Profile
import UserProfile from "../pages/Authentication/user-profile";

import FileManager from "../pages/FileManager";
import ToDoList from "../pages/ToDo";
import UiLink from "../pages/BaseUi/UiLinks/UiLinks";
import RangeArea from "../pages/Charts/ApexCharts/RangeAreaCharts"
import FunnelCharts from "../pages/Charts/ApexCharts/FunnelCharts";
import DashboardJob from "pages/Dashboardjob";
import Kanbanboard from "pages/Tasks/KanbanBoard";
import VerifyEmail from "../pages/Authentication/VerifyEmail";
import SocialCallback from "../Components/Custom/SocialCallback";
import EmailLinkLoginPage from "../pages/Authentication/EmailLinkLogin";
import MagicLoginPage from "../pages/Authentication/MagicLoginPage";
import ResetPasswordPage from "../pages/Authentication/ResetPassword";
import Home from "../pages/Custom/Home";
import Roles from "../pages/Custom/Roles";


const authProtectedRoutes = [
    {path: "/dashboard-analytics", element: <DashboardAnalytics/>},
    {path: "/dashboard-crm", element: <DashboardCrm/>},
    {path: "/dashboard", element: <DashboardEcommerce/>},
    {path: "/menu", element: <Home/>},
    {path: "/roles", element: <Roles/>},
    {path: "/index", element: <DashboardEcommerce/>},
    {path: "/dashboard-crypto", element: <DashboardCrypto/>},
    {path: "/dashboard-projects", element: <DashboardProject/>},
    {path: "/dashboard-nft", element: <DashboardNFT/>},
    {path: "/dashboard-jobs", element: <DashboardJob/>},
    {path: "/apps-calendar", element: <Calendar/>},
    {path: "/apps-calendar-month-grid", element: <MonthGrid/>},
    {path: "/apps-ecommerce-products", element: <EcommerceProducts/>},
    {path: "/apps-ecommerce-product-details", element: <EcommerceProductDetail/>},
    {path: "/apps-ecommerce-add-product", element: <EcommerceAddProduct/>},
    {path: "/apps-ecommerce-orders", element: <EcommerceOrders/>},
    {path: "/apps-ecommerce-order-details", element: <EcommerceOrderDetail/>},
    {path: "/apps-ecommerce-customers", element: <EcommerceCustomers/>},
    {path: "/apps-ecommerce-cart", element: <EcommerceCart/>},
    {path: "/apps-ecommerce-checkout", element: <EcommerceCheckout/>},
    {path: "/apps-ecommerce-sellers", element: <EcommerceSellers/>},
    {path: "/apps-ecommerce-seller-details", element: <EcommerceSellerDetail/>},

    {path: "/apps-file-manager", element: <FileManager/>},
    {path: "/apps-todo", element: <ToDoList/>},


    //Chat
    {path: "/apps-chat", element: <Chat/>},

    //EMail
    {path: "/apps-mailbox", element: <MailInbox/>},
    {path: "/apps-email-basic", element: <BasicAction/>},
    {path: "/apps-email-ecommerce", element: <EcommerceAction/>},

    //Projects
    {path: "/apps-projects-list", element: <ProjectList/>},
    {path: "/apps-projects-overview", element: <ProjectOverview/>},
    {path: "/apps-projects-create", element: <CreateProject/>},

    //Task
    {path: "/apps-tasks-kanban", element: <Kanbanboard/>},
    {path: "/apps-tasks-list-view", element: <TaskList/>},
    {path: "/apps-tasks-details", element: <TaskDetails/>},

    //Crm
    {path: "/apps-crm-contacts", element: <CrmContacts/>},
    {path: "/apps-crm-companies", element: <CrmCompanies/>},
    {path: "/apps-crm-deals", element: <CrmDeals/>},
    {path: "/apps-crm-leads", element: <CrmLeads/>},

    //Invoices
    {path: "/apps-invoices-list", element: <InvoiceList/>},
    {path: "/apps-invoices-details", element: <InvoiceDetails/>},
    {path: "/apps-invoices-create", element: <InvoiceCreate/>},

    //Supports Tickets
    {path: "/apps-tickets-list", element: <ListView/>},
    {path: "/apps-tickets-details", element: <TicketsDetails/>},

    //transactions
    {path: "/apps-crypto-transactions", element: <Transactions/>},
    {path: "/apps-crypto-buy-sell", element: <BuySell/>},
    {path: "/apps-crypto-orders", element: <CryproOrder/>},
    {path: "/apps-crypto-wallet", element: <MyWallet/>},
    {path: "/apps-crypto-ico", element: <ICOList/>},
    {path: "/apps-crypto-kyc", element: <KYCVerification/>},

    // NFT Marketplace
    {path: "/apps-nft-marketplace", element: <Marketplace/>},
    {path: "/apps-nft-collections", element: <Collections/>},
    {path: "/apps-nft-create", element: <CreateNFT/>},
    {path: "/apps-nft-creators", element: <Creators/>},
    {path: "/apps-nft-explore", element: <ExploreNow/>},
    {path: "/apps-nft-item-details", element: <ItemDetails/>},
    {path: "/apps-nft-auction", element: <LiveAuction/>},
    {path: "/apps-nft-ranking", element: <Ranking/>},
    {path: "/apps-nft-wallet", element: <WalletConnect/>},

    //charts
    {path: "/charts-apex-line", element: <LineCharts/>},
    {path: "/charts-apex-area", element: <AreaCharts/>},
    {path: "/charts-apex-column", element: <ColumnCharts/>},
    {path: "/charts-apex-bar", element: <BarCharts/>},
    {path: "/charts-apex-mixed", element: <MixedCharts/>},
    {path: "/charts-apex-timeline", element: <TimelineCharts/>},
    {path: "/charts-apex-range-area", element: <RangeArea/>},
    {path: "/charts-apex-funnel", element: <FunnelCharts/>},
    {path: "/charts-apex-candlestick", element: <CandlestickChart/>},
    {path: "/charts-apex-boxplot", element: <BoxplotCharts/>},
    {path: "/charts-apex-bubble", element: <BubbleChart/>},
    {path: "/charts-apex-scatter", element: <ScatterCharts/>},
    {path: "/charts-apex-heatmap", element: <HeatmapCharts/>},
    {path: "/charts-apex-treemap", element: <TreemapCharts/>},
    {path: "/charts-apex-pie", element: <PieCharts/>},
    {path: "/charts-apex-radialbar", element: <RadialbarCharts/>},
    {path: "/charts-apex-radar", element: <RadarCharts/>},
    {path: "/charts-apex-polar", element: <PolarCharts/>},

    {path: "/charts-chartjs", element: <ChartsJs/>},
    {path: "/charts-echarts", element: <Echarts/>},


    // Base Ui
    {path: "/ui-alerts", element: <UiAlerts/>},
    {path: "/ui-badges", element: <UiBadges/>},
    {path: "/ui-buttons", element: <UiButtons/>},
    {path: "/ui-colors", element: <UiColors/>},
    {path: "/ui-cards", element: <UiCards/>},
    {path: "/ui-carousel", element: <UiCarousel/>},
    {path: "/ui-dropdowns", element: <UiDropdowns/>},
    {path: "/ui-grid", element: <UiGrid/>},
    {path: "/ui-images", element: <UiImages/>},
    {path: "/ui-tabs", element: <UiTabs/>},
    {path: "/ui-accordions", element: <UiAccordions/>},
    {path: "/ui-modals", element: <UiModals/>},
    {path: "/ui-offcanvas", element: <UiOffcanvas/>},
    {path: "/ui-placeholders", element: <UiPlaceholders/>},
    {path: "/ui-progress", element: <UiProgress/>},
    {path: "/ui-notifications", element: <UiNotifications/>},
    {path: "/ui-media", element: <UiMediaobject/>},
    {path: "/ui-embed-video", element: <UiEmbedVideo/>},
    {path: "/ui-typography", element: <UiTypography/>},
    {path: "/ui-lists", element: <UiList/>},
    {path: "/ui-links", element: <UiLink/>},
    {path: "/ui-general", element: <UiGeneral/>},
    {path: "/ui-ribbons", element: <UiRibbons/>},
    {path: "/ui-utilities", element: <UiUtilities/>},

    // Advance Ui
    {path: "/advance-ui-scrollbar", element: <UiScrollbar/>},
    {path: "/advance-ui-animation", element: <UiAnimation/>},
    {path: "/advance-ui-swiper", element: <UiSwiperSlider/>},
    {path: "/advance-ui-ratings", element: <UiRatings/>},
    {path: "/advance-ui-highlight", element: <UiHighlight/>},

    // Widgets
    {path: "/widgets", element: <Widgets/>},

    // Forms
    {path: "/forms-elements", element: <BasicElements/>},
    {path: "/forms-select", element: <FormSelect/>},
    {path: "/forms-editors", element: <FormEditor/>},
    {path: "/forms-checkboxes-radios", element: <CheckBoxAndRadio/>},
    {path: "/forms-masks", element: <Masks/>},
    {path: "/forms-file-uploads", element: <FileUpload/>},
    {path: "/forms-pickers", element: <FormPickers/>},
    {path: "/forms-range-sliders", element: <FormRangeSlider/>},
    {path: "/forms-layouts", element: <Formlayouts/>},
    {path: "/forms-validation", element: <FormValidation/>},
    {path: "/forms-wizard", element: <FormWizard/>},
    {path: "/forms-advanced", element: <FormAdvanced/>},
    {path: "/forms-select2", element: <Select2/>},

    //Tables
    {path: "/tables-basic", element: <BasicTables/>},
    {path: "/tables-react", element: <ReactTable/>},

    //Icons
    {path: "/icons-remix", element: <RemixIcons/>},
    {path: "/icons-boxicons", element: <BoxIcons/>},
    {path: "/icons-materialdesign", element: <MaterialDesign/>},
    {path: "/icons-feather", element: <FeatherIcons/>},
    {path: "/icons-lineawesome", element: <LineAwesomeIcons/>},
    {path: "/icons-crypto", element: <CryptoIcons/>},

    //Maps
    {path: "/maps-google", element: <GoogleMaps/>},

    //Pages
    {path: "/pages-starter", element: <Starter/>},
    {path: "/pages-profile", element: <SimplePage/>},
    {path: "/pages-profile-settings", element: <Settings/>},
    {path: "/pages-team", element: <Team/>},
    {path: "/pages-timeline", element: <Timeline/>},
    {path: "/pages-faqs", element: <Faqs/>},
    {path: "/pages-gallery", element: <Gallery/>},
    {path: "/pages-pricing", element: <Pricing/>},
    {path: "/pages-sitemap", element: <SiteMap/>},
    {path: "/pages-search-results", element: <SearchResults/>},
    {path: "/pages-privecy-policy", element: <PrivecyPolicy/>},
    {path: "/pages-terms-condition", element: <TermsCondition/>},

    //User Profile
    {path: "/profile", element: <UserProfile/>},

    // this route should be at the end of all other routes
    // eslint-disable-next-line react/display-name
    {
        path: "/",
        exact: true,
        element: <Navigate to="/home"/>,
    },
    {path: "*", element: <Navigate to="/dashboard"/>},
    //Job pages
    {path: "/apps-job-statistics", element: <Statistics/>},
    {path: "/apps-job-lists", element: <JobList/>},
    {path: "/apps-job-grid-lists", element: <JobGrid/>},
    {path: "/apps-job-details", element: <JobOverview/>},
    {path: "/apps-job-candidate-lists", element: <CandidateList/>},
    {path: "/apps-job-candidate-grid", element: <CandidateGrid/>},
    {path: "/apps-job-application", element: <Application/>},
    {path: "/apps-job-new", element: <NewJobs/>},
    {path: "/apps-job-companies-lists", element: <CompaniesList/>},
    {path: "/apps-job-categories", element: <JobCategories/>},

    //APIkey
    {path: "/apps-api-key", element: <ApiKey/>},
];

const publicRoutes = [
    // Authentication Page
    {path: "/logout", element: <Logout/>},
    {path: "/login", element: <Login/>},
    {path: "/forgot-password", element: <ForgetPasswordPage/>},
    {path: "/email-auth", element: <EmailLinkLoginPage/>},
    {path: "/magic-login", element: <MagicLoginPage/>},
    {path: "/register", element: <Register/>},
    {path: "/verify-email", element: <VerifyEmail/>},
    {path: "/social-callback", element: <SocialCallback/>},
    {path: "/reset-password", element: <ResetPasswordPage/>},

    //AuthenticationInner pages
    {path: "/auth-signin-basic", element: <BasicSignIn/>},
    {path: "/auth-signin-cover", element: <CoverSignIn/>},
    {path: "/auth-signup-basic", element: <BasicSignUp/>},
    {path: "/auth-signup-cover", element: <CoverSignUp/>},
    {path: "/auth-pass-reset-basic", element: <BasicPasswReset/>},
    {path: "/auth-pass-reset-cover", element: <CoverPasswReset/>},
    {path: "/auth-lockscreen-basic", element: <BasicLockScreen/>},
    {path: "/auth-lockscreen-cover", element: <CoverLockScreen/>},
    {path: "/auth-logout-basic", element: <BasicLogout/>},
    {path: "/auth-logout-cover", element: <CoverLogout/>},
    {path: "/auth-success-msg-basic", element: <BasicSuccessMsg/>},
    {path: "/auth-success-msg-cover", element: <CoverSuccessMsg/>},
    {path: "/auth-twostep-basic", element: <BasicTwosVerify/>},
    {path: "/auth-twostep-cover", element: <CoverTwosVerify/>},
    {path: "/auth-404-basic", element: <Basic404/>},
    {path: "/auth-404-cover", element: <Cover404/>},
    {path: "/auth-404-alt", element: <Alt404/>},
    {path: "/auth-500", element: <Error500/>},
    {path: "/pages-maintenance", element: <Maintenance/>},
    {path: "/pages-coming-soon", element: <ComingSoon/>},

    {path: "/landing", element: <OnePage/>},
    {path: "/nft-landing", element: <NFTLanding/>},
    {path: "/job-landing", element: <JobLanding/>},

    {path: "/auth-pass-change-basic", element: <BasicPasswCreate/>},
    {path: "/auth-pass-change-cover", element: <CoverPasswCreate/>},
    {path: "/auth-offline", element: <Offlinepage/>},

];

export {authProtectedRoutes, publicRoutes};