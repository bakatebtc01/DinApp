import React, { useState, useEffect } from "react";
import Head from "next/head";
import { FileManager } from "../../lib/fileManager";
import { File } from "../../lib/file";

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fileManager] = useState(new FileManager("/"));
  const [files, setFiles] = useState<File[]>([]);
  const [currentPath, setCurrentPath] = useState("/");

  useEffect(() => {
    // Fetch stats and transactions from the backend
    const fetchData = async () => {
      try {
        const statsRes = await fetch("http://localhost:3001/admin/stats");
        const statsData = await statsRes.json();
        setStats(statsData);

        const txRes = await fetch("http://localhost:3001/admin/transactions");
        const txData = await txRes.json();
        setTransactions(txData);
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFiles = async () => {
      const fileList = await fileManager.listFiles();
      setFiles(fileList);
      setCurrentPath(fileManager.currentPath);
    };

    fetchData();
    fetchFiles();
  }, [fileManager]);

  if (loading)
    return (
      <div className="p-8 text-white bg-slate-900 min-h-screen">
        Loading Dashboard...
      </div>
    );

  const handleCreateDirectory = async () => {
    const dirName = prompt("Enter directory name:");
    if (dirName) {
      await fileManager.createDirectory(dirName);
      const fileList = await fileManager.listFiles();
      setFiles(fileList);
    }
  };

  const handleDeleteFile = async (fileName: string) => {
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
      await fileManager.deleteFile(fileName);
      const fileList = await fileManager.listFiles();
      setFiles(fileList);
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white p-8 font-sans">
      <Head>
        <title>DinApp | Admin Sandbox Dashboard</title>
      </Head>

      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Sandbox Dashboard
          </h1>
          <p className="text-slate-400 mt-2">
            Real-time Platform Monitoring & Compliance
          </p>
        </div>
        <div className="flex gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors font-semibold">
            Export AML Report
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          {
            label: "Total Users",
            value: stats?.totalUsers,
            color: "border-cyan-500",
          },
          {
            label: "Active Wallets",
            value: stats?.activeWallets,
            color: "border-blue-500",
          },
          {
            label: "Platform Revenue",
            value: `${stats?.totalRevenue} PGK`,
            color: "border-emerald-500",
          },
          {
            label: "AML Alerts",
            value: "3 Pending",
            color: "border-rose-500 text-rose-400",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`bg-slate-800 p-6 rounded-2xl border-l-4 ${stat.color} shadow-lg`}
          >
            <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">
              {stat.label}
            </p>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Transaction Monitoring */}
      <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Transaction Monitoring Feed</h2>
          <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded-full border border-emerald-500/20">
            Live Update Enabled
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-sm">
                <th className="pb-3 font-medium">Tx ID</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx: any) => (
                <tr
                  key={tx.id}
                  className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                >
                  <td className="py-4 font-mono text-xs text-slate-300">
                    {tx.id.substring(0, 8)}...
                  </td>
                  <td className="py-4 capitalize">
                    <span className="bg-slate-700 px-2 py-1 rounded text-xs">
                      {tx.transaction_type}
                    </span>
                  </td>
                  <td className="py-4 font-semibold">
                    {tx.amount} {tx.currency}
                  </td>
                  <td className="py-4">
                    <span className="text-emerald-400 text-xs flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>{" "}
                      Settlement Confirmed
                    </span>
                  </td>
                  <td className="py-4 text-slate-400 text-sm">
                    {new Date(tx.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* File Manager */}
      <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">File Manager</h2>
          <div className="flex gap-4">
            <button
              onClick={handleCreateDirectory}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors font-semibold"
            >
              Create Directory
            </button>
            <button className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg transition-colors font-semibold">
              Upload File
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <p className="text-slate-400 mb-2">Current Path: {currentPath}</p>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-sm">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Size</th>
                <th className="pb-3 font-medium">Last Modified</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-500">
                    No files or directories.
                  </td>
                </tr>
              )}
              {files.map((file) => (
                <tr
                  key={file.name}
                  className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                >
                  <td className="py-4">{file.name}</td>
                  <td className="py-4">
                    {file.isDirectory
                      ? "-"
                      : `${(file.size / 1024).toFixed(2)} KB`}
                  </td>
                  <td className="py-4 text-slate-400 text-sm">
                    {file.updatedAt.toLocaleString()}
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => handleDeleteFile(file.name)}
                      className="text-rose-500 hover:text-rose-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
