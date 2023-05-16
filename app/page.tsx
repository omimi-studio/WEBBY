"use client";
import './globals.css'
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import { TransactionsProvider } from "../context/TransactionContext";
import { Navbar, Welcome, Footer, Services, Transactions } from "../components";
export default function Home() {
  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <TransactionsProvider>
          <div className="min-h-screen">
            <div className="gradient-bg-welcome">
              <Navbar />
              <Welcome />
            </div>
            <Services />
            <Transactions />
            <Footer />
          </div>
        </TransactionsProvider>
      </NotificationProvider>
    </MoralisProvider>
  );
}
