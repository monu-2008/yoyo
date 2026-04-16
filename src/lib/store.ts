import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AppView = "main" | "fullProducts";
export type AdminType = "none" | "admin" | "master";

interface StaffUser {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AdminUser {
  email: string;
  displayName: string | null;
  photoURL: string | null;
  uid: string;
}

export interface SiteTheme {
  primaryColor: string;
  backgroundColor: string;
  accentColor: string;
  secondaryColor: string;
}

const DEFAULT_THEME: SiteTheme = {
  primaryColor: "#0055ff",
  backgroundColor: "#ffffff",
  accentColor: "#ff3d00",
  secondaryColor: "#7c3aff",
};

interface AppState {
  view: AppView;
  adminLoggedIn: boolean;
  adminType: AdminType;
  adminUser: AdminUser | null;
  staffLoggedIn: boolean;
  staffUser: StaffUser | null;
  bookingModalOpen: boolean;
  siteTheme: SiteTheme;
  setView: (view: AppView) => void;
  setAdminLoggedIn: (val: boolean) => void;
  setAdminType: (type: AdminType) => void;
  setAdminUser: (user: AdminUser | null) => void;
  setStaffLoggedIn: (val: boolean) => void;
  setStaffUser: (user: StaffUser | null) => void;
  setBookingModalOpen: (val: boolean) => void;
  setSiteTheme: (theme: Partial<SiteTheme>) => void;
  adminLogout: () => void;
  staffLogout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      view: "main",
      adminLoggedIn: false,
      adminType: "none",
      adminUser: null,
      staffLoggedIn: false,
      staffUser: null,
      bookingModalOpen: false,
      siteTheme: DEFAULT_THEME,
      setView: (view) => set({ view }),
      setAdminLoggedIn: (val) => set({ adminLoggedIn: val }),
      setAdminType: (type) => set({ adminType: type }),
      setAdminUser: (adminUser) => set({ adminUser }),
      setStaffLoggedIn: (val) => set({ staffLoggedIn: val }),
      setStaffUser: (staffUser) => set({ staffUser }),
      setBookingModalOpen: (val) => set({ bookingModalOpen: val }),
      setSiteTheme: (theme) => set((state) => ({ siteTheme: { ...state.siteTheme, ...theme } })),
      adminLogout: () => set({ adminLoggedIn: false, adminType: "none", adminUser: null }),
      staffLogout: () => set({ staffUser: null, staffLoggedIn: false }),
    }),
    {
      name: "race-computer-store",
      partialize: (state) => ({
        adminLoggedIn: state.adminLoggedIn,
        adminType: state.adminType,
        adminUser: state.adminUser,
        staffLoggedIn: state.staffLoggedIn,
        staffUser: state.staffUser,
        siteTheme: state.siteTheme,
      }),
    }
  )
);
