
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner closeButton position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/about-us" element={<Layout><AboutUs /></Layout>} />
          <Route path="/category/:categoryName" element={<Layout><Index /></Layout>} />
          <Route path="/search" element={<Layout><Index /></Layout>} />
          <Route path="/cart" element={<Layout><Index /></Layout>} />
          <Route path="/wishlist" element={<Layout><Index /></Layout>} />
          <Route path="/account" element={<Layout><Index /></Layout>} />
          <Route path="/contact" element={<Layout><AboutUs /></Layout>} />
          <Route path="/faq" element={<Layout><AboutUs /></Layout>} />
          <Route path="/returns" element={<Layout><AboutUs /></Layout>} />
          <Route path="/shipping" element={<Layout><AboutUs /></Layout>} />
          <Route path="/terms" element={<Layout><AboutUs /></Layout>} />
          <Route path="/privacy" element={<Layout><AboutUs /></Layout>} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
