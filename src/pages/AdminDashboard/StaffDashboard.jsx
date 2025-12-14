import React from "react";
import Sidebar from "../../components/Sidebar";
import DashboardDropDown from "../../components/DashboardDropDown";
function StaffDashboard({setUserRole, userRole}) {
    return (
        <div>
            <nav className="fixed top-0 z-50 w-full bg-neutral-primary-soft border-b border-default">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button data-drawer-target="top-bar-sidebar" data-drawer-toggle="top-bar-sidebar" aria-controls="top-bar-sidebar" type="button" className="sm:hidden text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base text-sm p-2 focus:outline-none">
                                <span className="sr-only">Open sidebar</span>
                                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h10" />
                                </svg>
                            </button>
                            {/* <a href="/dashboard" className="flex ms-2 md:me-24">
                <span className="self-center text-lg font-semibold whitespace-nowrap dark:text-white"></span>
              </a> */}
                        </div>
                        <DashboardDropDown setUserRole={setUserRole} />
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <Sidebar setUserRole={setUserRole} userRole={userRole} />

            <div className="p-4 sm:ml-64 mt-14">
                <h1>Staff dashboard</h1>
            </div>

        </div>
    )
}

export default StaffDashboard;