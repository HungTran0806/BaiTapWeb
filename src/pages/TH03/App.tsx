import StaffManager from './StaffManager';
import ServiceManager from './ServiceManager';
import Appointment from './Appointment';
import Review from './Review';
import Report from './Report';


function App() {
  return (
    <div>
      <h1>He thong dat lich dich vu</h1>

      <StaffManager />

      <ServiceManager />

      <Appointment />

      <Review />

      <Report appointments={[]} />
    </div>
  );
};

export default App;