
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Book, Clock, AlertTriangle, Search, FileText } from 'lucide-react';
import {
  checkoutBook,
  returnBook,
  renewBook,
  fetchActiveLoans,
  fetchHistory
} from '../features/transactions/transactionsThunk';
import { clearError, clearSuccessMessage } from '../features/transactions/transactionsSlice';
import type { RootState, AppDispatch } from '../features/store';

// Book Checkout Component
const BookCheckout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, successMessage } = useSelector((state: RootState) => state.transactions);

  const [memberId, setMemberId] = useState('');
  const [bookIsbn, setBookIsbn] = useState('');
  const [action, setAction] = useState('Book Checkout');

  // Clear messages when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccessMessage());
    };
  }, [dispatch]);

  const handleProcessTransaction = async () => {
    // Validation
    if (!memberId.trim() || !bookIsbn.trim()) {
      alert('Please enter both Member ID and Book ISBN');
      return;
    }

    try {
      if (action === 'Book Checkout') {
        await dispatch(checkoutBook({
          memberId: memberId.trim(),
          isbn: bookIsbn.trim()
        })).unwrap();
      } else {
        await dispatch(returnBook(bookIsbn.trim())).unwrap();
      }

      // Reset form on success
      setMemberId('');
      setBookIsbn('');
    } catch (err: any) {
      // Error is already handled by Redux
      console.error('Transaction error:', err);
    }
  };

  const handleResetForm = () => {
    setMemberId('');
    setBookIsbn('');
    dispatch(clearError());
    dispatch(clearSuccessMessage());
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="flex items-start gap-2 mb-2">
        <Book className="w-6 h-6 mt-1" />
        <div>
          <h2 className="text-2xl font-bold">New Book Transaction</h2>
          <p className="text-gray-500 mt-1">Issue or return books to library members</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600 font-medium">{successMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Member ID or Name
            </label>
            <input
              type="text"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              placeholder="Enter member ID or search by name...."
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Book ISBN or Title
            </label>
            <input
              type="text"
              value={bookIsbn}
              onChange={(e) => setBookIsbn(e.target.value)}
              placeholder="Enter ISBN or search by title...."
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action
            </label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option>Book Checkout</option>
              <option>Book Return</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleProcessTransaction}
              disabled={loading}
              className={`px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Processing...' : 'Process Transaction'}
            </button>
            <button
              onClick={handleResetForm}
              disabled={loading}
              className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset Form
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-medium text-gray-900 mb-3">Member Information</h3>
            <p className="text-gray-500 text-sm">Select a member to view their details</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-medium text-gray-900 mb-3">Book Information</h3>
            <p className="text-gray-500 text-sm">Select a book to view its details</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Active Loans Component
const ActiveLoans: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeLoans, loading, error } = useSelector((state: RootState) => state.transactions);

  const [searchActive, setSearchActive] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [renewLoading, setRenewLoading] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchActiveLoans());
  }, [dispatch]);

  const filteredLoans = useMemo(() => {
    let filtered = [...activeLoans];

    if (searchActive.trim()) {
      const search = searchActive.toLowerCase();
      filtered = filtered.filter(
        (loan) =>
          loan.memberName.toLowerCase().includes(search) ||
          loan.bookTitle.toLowerCase().includes(search) ||
          loan.isbn.toLowerCase().includes(search)
      );
    }

    if (statusFilter !== 'All Status') {
      filtered = filtered.filter((loan) => loan.computedStatus === statusFilter);
    }

    return filtered;
  }, [activeLoans, searchActive, statusFilter]);

  const handleRenew = async (isbn: string) => {
    try {
      setRenewLoading(isbn);
      await dispatch(renewBook(isbn)).unwrap();
      alert('Book renewed successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to renew book');
    } finally {
      setRenewLoading(null);
    }
  };

  const getDaysLeft = (timeLeft: string) => {
    if (timeLeft === 'Returned') return 0;
    return parseInt(timeLeft) || 0;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Active':
        return 'bg-blue-100 text-blue-700';
      case 'Overdue':
        return 'bg-red-100 text-red-700';
      case 'Returned':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500">Loading active loans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-6 h-6 text-gray-700" />
          <h2 className="text-xl font-bold text-gray-900">Active Book Loans</h2>
        </div>
        <p className="text-gray-500 text-sm">Currently checked out books and their due dates</p>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchActive}
            onChange={(e) => setSearchActive(e.target.value)}
            placeholder="Search by member name or book title ..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[140px]"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Overdue</option>
          <option>Returned</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Member</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Book</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Checkout Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Due Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Days Left</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLoans.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-500">
                  {searchActive || statusFilter !== 'All Status'
                    ? 'No loans found matching your filters'
                    : 'No active loans found'}
                </td>
              </tr>
            ) : (
              filteredLoans.map((loan) => {
                const daysLeft = getDaysLeft(loan.timeLeft || '0');
                return (
                  <tr key={loan.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700">
                          {loan.memberName
                            .split(' ')
                            .map((n: string) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{loan.memberName}</div>
                          <div className="text-sm text-gray-500">{loan.memberNumber || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{loan.bookTitle}</div>
                      <div className="text-sm text-gray-500">{loan.isbn}</div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{loan.checkoutDate}</td>
                    <td className="py-4 px-4 text-gray-600">{loan.dueDate}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          loan.computedStatus
                        )}`}
                      >
                        {loan.computedStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {daysLeft < 0 ? (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-500" />
                        )}
                        <span
                          className={
                            daysLeft < 0 ? 'text-red-600 font-medium' : 'text-yellow-600 font-medium'
                          }
                        >
                          {Math.abs(daysLeft)} Day{Math.abs(daysLeft) !== 1 ? 's' : ''}{' '}
                          {daysLeft < 0 ? 'Overdue' : 'Left'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleRenew(loan.isbn)}
                        disabled={renewLoading === loan.isbn}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        {renewLoading === loan.isbn ? 'Renewing...' : 'Renew'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Transaction History Component
const TransactionHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { history, loading, error } = useSelector((state: RootState) => state.transactions);

  const [searchHistory, setSearchHistory] = useState('');
  const [transactionFilter, setTransactionFilter] = useState('All Transaction');

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  const filteredHistory = useMemo(() => {
    let filtered = [...history];

    if (searchHistory.trim()) {
      const search = searchHistory.toLowerCase();
      filtered = filtered.filter(
        (txn) =>
          txn.memberName.toLowerCase().includes(search) ||
          txn.bookTitle.toLowerCase().includes(search) ||
          txn.isbn.toLowerCase().includes(search)
      );
    }

    if (transactionFilter !== 'All Transaction') {
      filtered = filtered.filter((txn) => txn.computedStatus === transactionFilter);
    }

    return filtered;
  }, [history, searchHistory, transactionFilter]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Active':
        return 'bg-blue-100 text-blue-700';
      case 'Overdue':
        return 'bg-red-100 text-red-700';
      case 'Returned':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500">Loading transaction history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-6 h-6 text-gray-700" />
          <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
        </div>
        <p className="text-gray-500 text-sm">Complete history of all book transactions</p>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchHistory}
            onChange={(e) => setSearchHistory(e.target.value)}
            placeholder="Search transaction history ..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={transactionFilter}
          onChange={(e) => setTransactionFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[180px]"
        >
          <option>All Transaction</option>
          <option>Active</option>
          <option>Overdue</option>
          <option>Returned</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Transaction ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Member</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Book</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Checkout Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Due Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Return Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-500">
                  {searchHistory || transactionFilter !== 'All Transaction'
                    ? 'No transactions found matching your filters'
                    : 'No transaction history found'}
                </td>
              </tr>
            ) : (
              filteredHistory.map((txn) => (
                <tr key={txn.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm text-gray-700">#{txn.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700">
                        {txn.memberName
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{txn.memberName}</div>
                        <div className="text-sm text-gray-500">{txn.memberNumber || '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{txn.bookTitle}</div>
                    <div className="text-sm text-gray-500">{txn.isbn}</div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{txn.checkoutDate}</td>
                  <td className="py-4 px-4 text-gray-600">{txn.dueDate}</td>
                  <td className="py-4 px-4 text-gray-600">{txn.returnDate || '-'}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        txn.computedStatus
                      )}`}
                    >
                      {txn.computedStatus}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Component with React Router
const Transaction: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/active')) return 'active';
    if (path.includes('/history')) return 'history';
    return 'checkout';
  };

  const activeTab = getActiveTab();

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case 'checkout':
        navigate('/transactions/checkout');
        break;
      case 'active':
        navigate('/transactions/active');
        break;
      case 'history':
        navigate('/transactions/history');
        break;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'active':
        return <ActiveLoans />;
      case 'history':
        return <TransactionHistory />;
      case 'checkout':
      default:
        return <BookCheckout />;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transaction Management</h1>
        <p className="text-gray-600 mt-1">Manage book checkouts, returns, and track overdue items</p>
      </div>

      <div className="bg-gray-100 rounded-lg p-1 mb-8 inline-flex">
        <button
          onClick={() => handleTabChange('checkout')}
          className={`px-8 py-3 rounded-md font-medium transition-colors ${
            activeTab === 'checkout'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Book Checkout
        </button>
        <button
          onClick={() => handleTabChange('active')}
          className={`px-8 py-3 rounded-md font-medium transition-colors ${
            activeTab === 'active'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Active Loans
        </button>
        <button
          onClick={() => handleTabChange('history')}
          className={`px-8 py-3 rounded-md font-medium transition-colors ${
            activeTab === 'history'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Transaction History
        </button>
      </div>

      {renderContent()}
    </div>
  );
};

export default Transaction;