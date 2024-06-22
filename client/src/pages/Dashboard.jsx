import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { formatCurrency } from '../utils/helpers';

import BarChart from '../components/StatsBarChart';
import PieChart from '../components/StatsPieChart';

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [month, setMonth] = useState(3);
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        const statisticsResponse = await axios.get(
          `http://localhost:3000/api/v1/transactions/statistics/${month}`
        );
        setStatistics(statisticsResponse.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, [month]);

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const transactionsResponse = await axios.get(
        `http://localhost:3000/api/v1/transactions/${month}?page=${page}&search=${searchTerm}`
      );
      setTransactions(transactionsResponse.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setIsLoading(false);
    }
  }, [month, page, searchTerm]);

  const debouncedFetchTransactions = useCallback(
    debounce(fetchTransactions, 800),
    [fetchTransactions]
  );

  useEffect(() => {
    debouncedFetchTransactions();
  }, [debouncedFetchTransactions]);

  function handleIncrement() {
    setPage((prevPage) => prevPage + 1);
  }

  function handleDecrement() {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  }

  return (
    <div className="py-8">
      <h2 className="text-4xl font-bold">Dashboard</h2>
      <div className="flex w-full gap-4 mt-4">
        <div className="p-2 px-4 rounded-lg w-1/3 h-32 bg-slate-200 flex flex-col gap-2 justify-center">
          <p>Total Sales</p>
          <p className="font-bold text-3xl font-sono">
            {statistics &&
              statistics.saleStatistics &&
              formatCurrency(statistics.saleStatistics.totalSales)}
          </p>
        </div>
        <div className="p-2 px-4 rounded-lg w-1/3 h-32 bg-slate-200 flex flex-col gap-2 justify-center">
          <p>Sold Items</p>
          <p className="font-bold text-3xl">
            {statistics &&
              statistics.saleStatistics &&
              statistics.saleStatistics.soldItems}
          </p>
        </div>
        <div className="p-2 px-4 rounded-lg w-1/3 h-32 bg-slate-200 flex flex-col gap-2 justify-center">
          <p>Not Sold Items</p>
          <p className="font-bold text-3xl">
            {statistics &&
              statistics.saleStatistics &&
              statistics.saleStatistics.notSoldItems}
          </p>
        </div>
      </div>
      <div className="flex gap-4 mt-6 w-full">
        {statistics && statistics.barChartData && statistics.pieChartData && (
          <>
            <BarChart data={statistics.barChartData} />
            <PieChart data={statistics.pieChartData} />
          </>
        )}
      </div>
      <div>
        <p className="font-bold text-xl">Recent Transactions</p>
        <select
          value={month}
          className="px-4 py-2 w-1/2 rounded-lg mt-4 h-12"
          onChange={(e) => setMonth(e.target.value)}
        >
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 w-full rounded-lg mt-4 bg-[#e5e7eb] placeholder-black"
          placeholder="Search Transactions "
        />
      </div>
      <div className="overflow-x-auto mt-4">
        {transactions.length !== 0 && !isLoading ? (
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Title
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Description
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Price
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Category
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Sold
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Image
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {transactions.map((transaction) => (
                <tr
                  key={transaction._id}
                  className="hover:bg-gray-100 border-b border-gray-200 py-4"
                >
                  <td className="text-left py-3 px-4">{transaction.title}</td>
                  <td className="text-left py-3 px-4">
                    {transaction.description}
                  </td>
                  <td className="text-left py-3 px-4">{transaction.price}</td>

                  <td className="text-left py-3 px-4">
                    {transaction.category}
                  </td>

                  <td className="text-left py-3 px-4">
                    {transaction.sold ? 'Yes' : 'No'}
                  </td>
                  <td className="text-left py-3 px-4">
                    <img
                      src={transaction.image}
                      alt={transaction.title}
                      className="h-16 w-16 object-cover rounded-md"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h2 className="text-semibold mt-4">End Of Transactions</h2>
        )}
      </div>
      <div className="grid grid-cols-2 mt-4">
        <button
          className="justify-self-start bg-gray-800 text-white px-4 py-2 rounded-lg"
          onClick={handleDecrement}
        >
          Previous
        </button>
        <button
          className="justify-self-end bg-gray-800 text-white px-4 py-2 rounded-lg"
          onClick={handleIncrement}
        >
          Next
        </button>
      </div>
    </div>
  );
}
