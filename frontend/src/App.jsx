import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import LoginPage from "./pages/LoginPage";
import PaymentPage from "./pages/PaymentPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";
import SearchPage from "./pages/SearchPage";
import BookTicketPage from "./pages/BookTicketPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import TicketDetailsPage from "./pages/TicketDetailsPage";
import PnrStatusPage from "./pages/PnrStatusPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageTrainsPage from "./pages/admin/ManageTrainsPage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import ViewBookingsPage from "./pages/admin/ViewBookingsPage";
import ClerkDashboard from "./pages/clerk/ClerkDashboard";
import ClerkBookTicketPage from "./pages/clerk/ClerkBookTicketPage";
import ClerkCancelTicketPage from "./pages/clerk/ClerkCancelTicketPage";
import NotFoundPage from "./pages/NotFoundPage";
import TicketPage from "./pages/TicketPage";

const HomePage = () => {
  return (
    <div className="px-6 py-10">
      <h1 className="text-4xl font-bold">RailReserve Frontend Started</h1>
      <p className="mt-3 text-white/70">Common components are working.</p>
    </div>
  );
};

const App = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/search" element={<SearchPage />} />
  <Route path="/book/:trainId" element={<BookTicketPage />} />
  <Route path="/payment" element={<PaymentPage />} />
  <Route path="/booking-success" element={<BookingSuccessPage />} />
  <Route path="/my-bookings" element={<MyBookingsPage />} />
  <Route path="/ticket/:bookingId" element={<TicketDetailsPage />} />
  <Route path="/pnr-status" element={<PnrStatusPage />} />
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
  <Route path="/admin/trains" element={<ManageTrainsPage />} />
  <Route path="/admin/users" element={<ManageUsersPage />} />
  <Route path="/admin/bookings" element={<ViewBookingsPage />} />
  <Route path="/clerk/dashboard" element={<ClerkDashboard />} />
  <Route path="/clerk/book-ticket" element={<ClerkBookTicketPage />} />
  <Route path="/clerk/cancel-ticket" element={<ClerkCancelTicketPage />} />
  <Route path="*" element={<NotFoundPage />} />
  <Route path="/ticket/:id" element={<TicketPage />} />

</Routes>

      <Footer />
    </div>
  );
};

export default App;