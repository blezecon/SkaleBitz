import Landing from '../pages/Landing';
import NotFound from '../pages/NotFound';
import Register from '../pages/Register';
import Login from '../pages/Login';
import InvestorDashboard from '../pages/InvestorDashboard';
import InvestorDealDetail from '../pages/InvestorDealDetail';
import MSMEWizard from '../pages/MSMEWizard';
import OpsQueue from '../pages/OpsQueue';
import CommitPanel from '../components/deal/CommitPanel';
import DealCard from '../components/deal/DealCard';
import Deals from '../pages/src_pages_Deals';
import Logs from '../pages/src_pages_Logs';
import OpsTaskDetail from '../pages/src_pages_OpsTaskDetail';
import CashflowHistory from '../pages/src_pages_CashflowHistory';
import RiskReports from '../pages/src_pages_RiskReports';

function App() {
    return (
    <>
      <Landing />
      <NotFound />
      <Register />
      <Login />
      <InvestorDashboard />
      <InvestorDealDetail />
      <MSMEWizard />
      <OpsQueue />
      <CommitPanel />
      <DealCard />
      <Deals />
      <Logs />
      <OpsTaskDetail />
      <CashflowHistory />
      <RiskReports />
    </>
  );
}
export default App;