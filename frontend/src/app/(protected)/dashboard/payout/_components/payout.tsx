// import BalanceCard from "./balance-card";
// import PayoutHistory from "./payout-history";

import ManagePayout from "./manage-payout";

function Payout({ userId }: { userId: string }) {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Connected Status */}
      <ManagePayout />

      {/* Balance Card */}
      {/* <BalanceCard userId={userId} /> */}

      {/* Payout History */}
      {/* <PayoutHistory userId={userId} /> */}
    </div>
  );
}

export default Payout;
