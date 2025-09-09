import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiRefreshCw } from 'react-icons/fi';
import {
  MdAttachMoney,
  MdShoppingCart,
  MdPeople,
  MdLocalShipping,
  MdKeyboardArrowDown,
} from 'react-icons/md';
import { BsEye, BsPencil, BsTrash } from 'react-icons/bs';
import Header from './Headeradmin';
import appMockup from '../assets/app-mockup.png';
import websiteMockup from '../assets/website-mockup.png';
import inventoryApp from '../assets/inventory-app.png';

function Dashboard() {
  // State untuk bulan pada grafik
  const [selectedMonth, setSelectedMonth] = useState('Juni');

  // State untuk data transaksi real-time
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // State untuk dashboard analytics
  const [topCategories, setTopCategories] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  const [stats, setStats] = useState([
    {
      title: 'Total Pendapatan',
      value: 'Rp 0',
      icon: <MdAttachMoney className="text-blue-600" />,
    },
    {
      title: 'Total Order',
      value: '0',
      icon: <MdShoppingCart className="text-blue-600" />,
    },
    {
      title: 'Total Pembeli',
      value: '0',
      icon: <MdPeople className="text-blue-600" />,
    },
    {
      title: 'Sedang Diproses',
      value: '0',
      icon: <MdLocalShipping className="text-blue-600" />,
    },
  ]);

  // Fetch transactions from backend
  const fetchTransactions = async (showRefreshLoader = false) => {
    try {
      console.log('Fetching transactions from backend...');
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(
        'http://localhost:5000/api/payment/orders/dashboard',
      );
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        console.log('Transactions received:', data.transactions);
        setTransactions(data.transactions);

        // Calculate stats from real data
        const totalRevenue = data.transactions
          .filter(t => t.status === 'Selesai')
          .reduce((sum, t) => sum + parseInt(t.harga.replace(/[^\d]/g, '')), 0);

        const totalOrders = data.transactions.length;
        const uniqueBuyers = new Set(data.transactions.map(t => t.hp)).size;
        const processing = data.transactions.filter(
          t => t.status === 'Sedang Diproses',
        ).length;

        setStats([
          {
            title: 'Total Pendapatan',
            value: `Rp ${totalRevenue.toLocaleString('id-ID')}`,
            icon: <MdAttachMoney className="text-blue-600" />,
          },
          {
            title: 'Total Order',
            value: totalOrders.toString(),
            icon: <MdShoppingCart className="text-blue-600" />,
          },
          {
            title: 'Total Pembeli',
            value: uniqueBuyers.toString(),
            icon: <MdPeople className="text-blue-600" />,
          },
          {
            title: 'Sedang Diproses',
            value: processing.toString(),
            icon: <MdLocalShipping className="text-blue-600" />,
          },
        ]);
      } else {
        console.error('Failed to fetch transactions:', data.error);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    // For testing: Set admin user in localStorage if not exists
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: 1,
          firstName: 'Administrator',
          lastName: 'PKBI Kepri',
          email: 'pkbikepri@pkbi.or.id',
          isAdmin: true,
        }),
      );
      console.log('Test admin user set in localStorage');
    }

    fetchTransactions();
    fetchTopCategories();
    fetchTopProducts();

    const interval = setInterval(() => {
      fetchTransactions(true);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Manual refresh
  const handleManualRefresh = () => {
    fetchTransactions(true);
    fetchTopCategories();
    fetchTopProducts();
  };

  // Fetch top categories from backend
  const fetchTopCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch(
        'http://localhost:5000/api/payment/dashboard/top-categories',
      );
      const data = await response.json();

      if (data.success) {
        console.log('Top categories received:', data.categories);
        setTopCategories(data.categories);
      } else {
        console.error('Failed to fetch top categories:', data.message);
      }
    } catch (error) {
      console.error('Error fetching top categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Fetch top products from backend
  const fetchTopProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await fetch(
        'http://localhost:5000/api/payment/dashboard/top-products',
      );
      const data = await response.json();

      if (data.success) {
        console.log('Top products received:', data.products);
        setTopProducts(data.products);
      } else {
        console.error('Failed to fetch top products:', data.message);
        // Fallback to static data if API fails
        setTopProducts(staticTopProducts);
      }
    } catch (error) {
      console.error('Error fetching top products:', error);
      // Fallback to static data if API fails
      setTopProducts(staticTopProducts);
    } finally {
      setProductsLoading(false);
    }
  };

  // Data untuk top pembelian (carousel) - fallback static data
  const [currentIndex, setCurrentIndex] = useState(0);
  const staticTopProducts = [
    {
      name: 'Aplikasi Absensi Staf',
      price: 'Rp 2.000.000',
      image: appMockup,
    },
    {
      name: 'Website Company Profile',
      price: 'Rp 1.500.000',
      image: websiteMockup,
    },
    {
      name: 'Aplikasi Data Entry Relawan',
      price: 'Rp 2.500.000',
      image: inventoryApp,
    },
  ];

  const nextSlide = () => {
    const productsToUse =
      topProducts.length > 0 ? topProducts : staticTopProducts;
    setCurrentIndex(prevIndex => (prevIndex + 1) % productsToUse.length);
  };

  const prevSlide = () => {
    const productsToUse =
      topProducts.length > 0 ? topProducts : staticTopProducts;
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? productsToUse.length - 1 : prevIndex - 1,
    );
  };

  // Function untuk handle search (bisa disesuaikan dengan kebutuhan dashboard)
  const handleSearch = query => {
    // Implementasi search untuk dashboard jika diperlukan
    console.log('Search query:', query);
  };

  return (
    <div className="flex flex-col bg-white">
      {/* Header dengan Search Bar dan Logout */}
      <div className="w-full bg-black mb-6">
        <Header />
      </div>

      <div className="p-6 bg-white min-h-screen">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg border border-gray-100 flex items-center justify-between"
              style={{
                boxShadow: '6px 6px 54px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Chart */}
          <div className="md:col-span-2">
            <div
              className="bg-white p-6 rounded-lg border border-gray-100"
              style={{
                boxShadow: '6px 6px 21.5px #0070D8',
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Top Kategori</h2>
                <div className="relative">
                  <button
                    className="flex items-center border rounded-full px-3 py-1 hover:border-gray-400 transition-colors"
                    style={{ borderRadius: '500px' }}
                  >
                    {selectedMonth}
                    <MdKeyboardArrowDown className="ml-1" />
                  </button>
                  {/* Dropdown for month selection would go here */}
                </div>
              </div>

              {/* Bar Chart */}
              <div className="h-72 relative">
                {categoriesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-500">Loading categories...</div>
                  </div>
                ) : (
                  <>
                    {/* Dynamic chart based on real data */}
                    <div className="flex items-end justify-around h-full pt-10 pb-5">
                      {topCategories.length > 0 ? (
                        topCategories.map((category, index) => {
                          // Get color based on category type
                          const getBarColor = cat => {
                            if (cat.category === 'produk' && cat.type === 'buy')
                              return '#FAAD4F';
                            if (
                              cat.category === 'produk' &&
                              cat.type === 'order'
                            )
                              return '#00B69B';
                            if (
                              cat.category === 'layanan' &&
                              cat.type === 'buy'
                            )
                              return '#FF272D';
                            if (
                              cat.category === 'layanan' &&
                              cat.type === 'order'
                            )
                              return '#0070D8';
                            return '#6B7280';
                          };

                          // Calculate height based on count (max 200px)
                          const maxCount = Math.max(
                            ...topCategories.map(c => c.count),
                          );
                          const height =
                            maxCount > 0
                              ? (category.count / maxCount) * 200
                              : 20;

                          return (
                            <div
                              key={index}
                              className="flex flex-col items-center"
                            >
                              <div
                                className="w-12"
                                style={{
                                  height: `${height}px`,
                                  backgroundColor: getBarColor(category),
                                  borderRadius: '28px',
                                  minHeight: '20px',
                                }}
                                title={`${category.name}: ${category.count} orders`}
                              ></div>
                              <p className="text-xs mt-2 text-center max-w-16">
                                {category.name}
                              </p>
                            </div>
                          );
                        })
                      ) : (
                        // Fallback to static chart if no data
                        <>
                          <div className="flex flex-col items-center">
                            <div
                              className="w-12"
                              style={{
                                height: '120px',
                                backgroundColor: '#FAAD4F',
                                borderRadius: '28px',
                              }}
                            ></div>
                            <p className="text-xs mt-2">Produk Satuan</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <div
                              className="w-12"
                              style={{
                                height: '200px',
                                backgroundColor: '#00B69B',
                                borderRadius: '28px',
                              }}
                            ></div>
                            <p className="text-xs mt-2">Produk Paket</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <div
                              className="w-12"
                              style={{
                                height: '80px',
                                backgroundColor: '#FF272D',
                                borderRadius: '28px',
                              }}
                            ></div>
                            <p className="text-xs mt-2">Layanan Satuan</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <div
                              className="w-12"
                              style={{
                                height: '180px',
                                backgroundColor: '#0070D8',
                                borderRadius: '28px',
                              }}
                            ></div>
                            <p className="text-xs mt-2">Layanan Paket</p>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}

                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-4">
                  <span className="text-xs text-gray-500">100</span>
                  <span className="text-xs text-gray-500">80</span>
                  <span className="text-xs text-gray-500">60</span>
                  <span className="text-xs text-gray-500">40</span>
                  <span className="text-xs text-gray-500">20</span>
                  <span className="text-xs text-gray-500">0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Top Purchases */}
          <div>
            <div
              className="bg-white p-6 rounded-lg border border-gray-100"
              style={{
                boxShadow: '6px 6px 54px rgba(0, 0, 0, 0.05)',
              }}
            >
              <h2 className="text-lg font-semibold mb-6">Top Pembelian</h2>

              {/* Product Carousel */}
              <div className="relative">
                {productsLoading ? (
                  <div className="flex justify-center items-center h-72">
                    <div className="text-gray-500">Loading products...</div>
                  </div>
                ) : (
                  <>
                    <div className="overflow-hidden h-72">
                      <div className="flex justify-center items-center h-full">
                        <div className="text-center">
                          {(() => {
                            const productsToUse =
                              topProducts.length > 0
                                ? topProducts
                                : staticTopProducts;
                            const currentProduct =
                              productsToUse[currentIndex] || productsToUse[0];

                            return (
                              <>
                                <img
                                  src={currentProduct.image || appMockup}
                                  alt={currentProduct.name}
                                  className="h-40 mx-auto object-contain"
                                  onError={e => {
                                    e.target.src = appMockup; // Fallback image
                                  }}
                                />
                                <h3 className="text-lg font-medium mt-4">
                                  {currentProduct.name}
                                </h3>
                                <p className="text-blue-500 font-medium">
                                  {currentProduct.price}
                                </p>
                                {topProducts.length > 0 &&
                                  currentProduct.purchaseCount && (
                                    <p className="text-gray-500 text-sm mt-1">
                                      {currentProduct.purchaseCount} pembelian
                                    </p>
                                  )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Carousel Controls */}
                    {!productsLoading && (
                      <>
                        <button
                          onClick={prevSlide}
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: '#E2EAF8',
                          }}
                        >
                          <FiChevronLeft style={{ color: '#626262' }} />
                        </button>
                        <button
                          onClick={nextSlide}
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: '#E2EAF8',
                          }}
                        >
                          <FiChevronRight style={{ color: '#626262' }} />
                        </button>
                      </>
                    )}
                  </>
                )}

                {/* Legacy controls - removed from here */}
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="mt-6">
          <div
            className="bg-white rounded-lg border border-gray-100 overflow-hidden"
            style={{
              boxShadow: '6px 6px 54px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div className="flex justify-between items-center p-4">
              <h2 className="text-lg font-semibold">Detail Transaksi</h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleManualRefresh}
                  disabled={refreshing}
                  className="flex items-center px-3 py-1 border rounded-full hover:border-gray-400 transition-colors disabled:opacity-50"
                  style={{ borderRadius: '500px' }}
                >
                  <FiRefreshCw
                    className={`mr-1 ${refreshing ? 'animate-spin' : ''}`}
                  />
                  {refreshing ? 'Memperbarui...' : 'Refresh'}
                </button>
                <div className="relative">
                  <button
                    className="flex items-center border rounded-full px-3 py-1 hover:border-gray-400 transition-colors"
                    style={{ borderRadius: '500px' }}
                  >
                    Semua Status
                    <MdKeyboardArrowDown className="ml-1" />
                  </button>
                  {/* Dropdown for filter would go here */}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="text-gray-500">
                    <FiRefreshCw className="animate-spin text-2xl mb-2 mx-auto" />
                    Memuat data transaksi...
                  </div>
                </div>
              ) : transactions.length === 0 ? (
                <div className="flex justify-center items-center py-8">
                  <div className="text-gray-500">Belum ada transaksi</div>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-100 text-black">
                    <tr>
                      <th
                        className="px-4 py-3 text-left text-sm font-bold"
                        style={{
                          borderTopLeftRadius: '500px',
                          borderBottomLeftRadius: '500px',
                        }}
                      >
                        Nama Pembeli
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold">
                        Katalog
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold">
                        Kategori
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold">
                        No HP
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold">
                        Metode bayar
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold">
                        Harga
                      </th>
                      <th
                        className="px-4 py-3 text-left text-sm font-bold"
                        style={{
                          borderTopRightRadius: '500px',
                          borderBottomRightRadius: '500px',
                        }}
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => (
                      <tr
                        key={transaction.id}
                        className={index > 0 ? 'border-t' : ''}
                      >
                        <td className="px-4 py-4">{transaction.name}</td>
                        <td className="px-4 py-4">{transaction.katalog}</td>
                        <td className="px-4 py-4">{transaction.kategori}</td>
                        <td className="px-4 py-4">{transaction.hp}</td>
                        <td className="px-4 py-4">{transaction.metode}</td>
                        <td className="px-4 py-4">{transaction.harga}</td>
                        <td className="px-4 py-4">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium text-white"
                            style={{
                              backgroundColor:
                                transaction.status === 'Selesai'
                                  ? '#00B69B'
                                  : transaction.status === 'Sedang Diproses'
                                  ? '#0070D8'
                                  : transaction.status === 'Dibatalkan'
                                  ? '#FF3E43'
                                  : '#FFA500',
                            }}
                          >
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center p-4">
              <nav className="flex items-center">
                <button
                  className="flex items-center justify-center mx-1"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '18px',
                    border: '1px solid #979797',
                    backgroundColor: '#ffffff',
                    color: '#202224',
                  }}
                >
                  &lt;
                </button>
                <button
                  className="flex items-center justify-center mx-1"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    border: '1px solid #979797',
                    backgroundColor: '#ffffff',
                    color: '#202224',
                  }}
                >
                  1
                </button>
                <button
                  className="flex items-center justify-center mx-1"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    border: '1px solid #979797',
                    backgroundColor: '#ffffff',
                    color: '#202224',
                  }}
                >
                  2
                </button>
                <span className="mx-1">...</span>
                <button
                  className="flex items-center justify-center mx-1"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    border: '1px solid #979797',
                    backgroundColor: '#ffffff',
                    color: '#202224',
                  }}
                >
                  5
                </button>
                <button
                  className="flex items-center justify-center mx-1"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    border: '1px solid #979797',
                    backgroundColor: '#ffffff',
                    color: '#202224',
                  }}
                >
                  &gt;
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
