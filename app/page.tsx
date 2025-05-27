// "use client";
// import { useState } from "react";
// import AddCreator from "./components/addcreator";
// import AddOffers from "./components/addoffers";
// import AddStores from "./components/addstores";
// import { FaUsers, FaTags, FaCalendarAlt, FaStore, FaChartLine, FaArrowUp, FaArrowDown, FaShoppingCart, FaRegClock } from "react-icons/fa";
// import Link from "next/link";

// export default function Dashboard() {
//   const [modalContent, setModalContent] = useState<string | null>(null);

//   const stats = {
//     creators: 42,
//     creatorsChange: 12,
//     offers: 78,
//     offersChange: -5,
//     events: 15,
//     eventsChange: 3,
//     stores: 23,
//     storesChange: 8,
//   };

//   const recentActivity = [
//     { id: 1, type: "creator", name: "Alex Johnson", action: "registered", time: "2 mins ago" },
//     { id: 2, type: "offer", name: "Summer Sale", action: "created", time: "15 mins ago" },
//     { id: 3, type: "event", name: "Food Festival", action: "updated", time: "1 hour ago" },
//     { id: 4, type: "store", name: "Fashion Hub", action: "verified", time: "3 hours ago" },
//     { id: 5, type: "offer", name: "Tech Discount", action: "expired", time: "1 day ago" },
//   ];

//   const openModal = (action: string) => {
//     setModalContent(action);
//   };

//   const closeModal = () => {
//     setModalContent(null);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-primary">Dashboard Overview</h1>
//         <div className="text-tertiary text-sm">
//           Last updated: {new Date().toLocaleString()}
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard
//           icon={<FaUsers className="text-xl" />}
//           title="Creators"
//           value={stats.creators}
//           change={stats.creatorsChange}
//           changeType={stats.creatorsChange >= 0 ? "increase" : "decrease"}
//         />
//         <StatCard
//           icon={<FaTags className="text-xl" />}
//           title="Offers"
//           value={stats.offers}
//           change={Math.abs(stats.offersChange)}
//           changeType={stats.offersChange >= 0 ? "increase" : "decrease"}
//         />
//         <StatCard
//           icon={<FaCalendarAlt className="text-xl" />}
//           title="Events"
//           value={stats.events}
//           change={stats.eventsChange}
//           changeType={stats.eventsChange >= 0 ? "increase" : "decrease"}
//         />
//         <StatCard
//           icon={<FaStore className="text-xl" />}
//           title="Stores"
//           value={stats.stores}
//           change={stats.storesChange}
//           changeType={stats.storesChange >= 0 ? "increase" : "decrease"}
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Recent Activity */}
//         <div className="lg:col-span-2 bg-card rounded-lg border border-primary p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold text-primary">Recent Activity</h2>
//             <Link href="/activity" className="text-sm text-accent hover:underline">
//               View All
//             </Link>
//           </div>

//           <div className="space-y-4">
//             {recentActivity.map(activity => (
//               <ActivityItem key={activity.id} activity={activity} />
//             ))}
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="bg-card rounded-lg border border-primary p-6">
//           <h2 className="text-lg font-semibold text-primary mb-4">Quick Actions</h2>
//           <div className="grid grid-cols-1 gap-3">
//             <button
//               onClick={() => openModal("AddCreator")}
//               className="p-3 rounded-lg border flex items-center gap-3 border-primary text-primary hover:bg-surface"
//             >
//               <FaUsers />
//               Add Creator
//             </button>
//             <button
//               onClick={() => openModal("AddOffers")}
//               className="p-3 rounded-lg border flex items-center gap-3 border-primary text-primary hover:bg-surface"
//             >
//               <FaTags />
//               Create Offer
//             </button>
//             <button
//               onClick={() => openModal("AddStores")}
//               className="p-3 rounded-lg border flex items-center gap-3 border-primary text-primary hover:bg-surface"
//             >
//               <FaStore />
//               Register Store
//             </button>
//           </div>

//           {/* Stats Chart Placeholder */}
//           <div className="mt-8">
//             <h3 className="text-md font-medium text-primary mb-3">Weekly Performance</h3>
//             <div className="h-40 bg-surface rounded-lg flex items-center justify-center text-tertiary">
//               <FaChartLine className="text-4xl opacity-50" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal Popups */}
//       {modalContent === "AddCreator" && <AddCreator closeModal={closeModal} />}
//       {modalContent === "AddOffers" && <AddOffers closeModal={closeModal} />}
//       {modalContent === "AddStores" && <AddStores closeModal={closeModal} />}
//     </div>
//   );
// }

// function StatCard({ icon, title, value, change, changeType }: {
//   icon: React.ReactNode,
//   title: string,
//   value: number,
//   change: number,
//   changeType: "increase" | "decrease"
// }) {
//   return (
//     <div className="bg-card p-4 rounded-lg border border-primary hover:border-accent transition-all">
//       <div className="flex justify-between">
//         <div className="p-2 rounded-lg bg-surface border border-primary text-primary">
//           {icon}
//         </div>
//         <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
//           changeType === "increase"
//             ? 'text-success bg-success/10 border border-success/20'
//             : 'text-danger bg-danger/10 border border-danger/20'
//         }`}>
//           {changeType === "increase" ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
//           {change}%
//         </span>
//       </div>
//       <h3 className="text-tertiary text-sm mt-4">{title}</h3>
//       <p className="text-2xl font-bold mt-1 text-primary">{value}</p>
//       <div className="mt-3 h-px bg-primary/20"></div>
//     </div>
//   );
// }

// function ActivityItem({ activity }: { activity: any }) {
//   const getIcon = () => {
//     switch(activity.type) {
//       case "creator": return <FaUsers className="text-secondary" />;
//       case "offer": return <FaTags className="text-secondary" />;
//       case "event": return <FaCalendarAlt className="text-secondary" />;
//       case "store": return <FaStore className="text-secondary" />;
//       default: return <FaShoppingCart className="text-secondary" />;
//     }
//   };

//   const getColor = () => {
//     switch(activity.action) {
//       case "registered":
//       case "created":
//       case "verified":
//         return "text-success";
//       case "updated":
//         return "text-warning";
//       case "expired":
//         return "text-danger";
//       default:
//         return "text-primary";
//     }
//   };

//   return (
//     <div className="flex items-start gap-3 p-2 hover:bg-surface rounded-lg transition-all">
//       <div className="p-2 rounded-full bg-surface border border-primary">
//         {getIcon()}
//       </div>
//       <div className="flex-1">
//         <div className="flex justify-between">
//           <span className="text-primary font-medium">{activity.name}</span>
//           <span className="text-tertiary text-xs flex items-center gap-1">
//             <FaRegClock size={10} /> {activity.time}
//           </span>
//         </div>
//         <p className="text-sm">
//           <span className={getColor()}>{activity.action}</span> by system
//         </p>
//       </div>
//     </div>
//   );
// }

// function QuickAction({ icon, label, href, locked = false }: {
//   icon: React.ReactNode,
//   label: string,
//   href: string,
//   locked?: boolean
// }) {
//   return (
//     <Link
//       href={locked ? "#" : href}
//       className={`p-3 rounded-lg border flex items-center gap-3 ${
//         locked
//           ? "border-primary/30 text-tertiary cursor-not-allowed"
//           : "border-primary text-primary hover:bg-surface"
//       }`}
//     >
//       <span className="text-primary">{icon}</span>
//       <span>{label}</span>
//       {locked && <span className="ml-auto text-xs">🔒</span>}
//     </Link>
//   );
// }/
"use client";
import React, { useState } from "react";

const Page = () => {
  const [click, setClick] = useState(false);
  return (
    <>
      <div className="text-3xl font-bold">Hello , Mr Divyansh sharma !</div>
      <div
        onClick={() => setClick(!click)}
        className="text-sm bg-amber-100 p-2 select-none cursor-pointer active:bg-amber-200 text-black rounded w-fit mt-10 font-bold"
      >
        {click ? "close me" : "it hv short msg for you"}
      </div>
      <div
        className={
          click
            ? "p-10 border border-amber-100 rounded-r-2xl rounded-b-2xl "
            : "hidden"
        }
      >
        <div className="text-xl  mt-10 font-bold">
          . Sorrry for delay but what can i do there is a dev with that do some
          idt 😭 w0rk
        </div>
        <div className="text-xl  mt-10 font-bold">. internet issus 🫡</div>
        <div className="text-xl  mt-10 font-bold">. but malic kaam hogya 🫡</div>
      </div>
    </>
  );
};

export default Page;
