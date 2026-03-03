import { useState, useEffect } from 'react';
import { DollarSign, Calendar, Users, HardHat, TrendingUp, Star } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import SalesOverview from '../../components/ui/SalesOverview';
import { getOrders, type Order } from '../../utils/orderStore';
import { getEmployees, type Employee } from '../../utils/employeeStore';

const Dashboard = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersData, employeesData] = await Promise.all([
                    getOrders(),
                    Promise.resolve(getEmployees()) // getEmployees is synchronous from localStorage but keeping pattern
                ]);
                setOrders(ordersData);
                setEmployees(employeesData);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading dashboard data...</div>;
    }

    // Derived Metrics
    const completedOrders = orders.filter(o => o.status === 'Delivered');
    const totalSales = completedOrders.reduce((sum, order) => sum + order.total, 0);
    const totalBookings = orders.filter(o => o.type === 'Service' || o.type === 'Mixed').length;

    // Unique Customers
    const uniqueCustomers = new Set(orders.map(o => o.customerEmail)).size;
    const totalEmployees = employees.length;

    const currentMonth = new Date().getMonth();
    const earningsThisMonth = completedOrders
        .filter(order => new Date(order.date).getMonth() === currentMonth)
        .reduce((sum, order) => sum + order.total, 0);

    // Derived Lists
    const serviceBookings = orders
        .filter(o => o.type === 'Service' || o.type === 'Mixed')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4)
        .map(booking => {
            let statusColor = 'bg-slate-200 text-slate-600';
            if (booking.status === 'Pending') statusColor = 'bg-orange-100 text-orange-600';
            if (booking.status === 'Processing') statusColor = 'bg-amber-100 text-amber-600';
            if (booking.status === 'Shipped') statusColor = 'bg-indigo-100 text-indigo-600'; // Using for In Progress
            if (booking.status === 'Delivered') statusColor = 'bg-emerald-100 text-emerald-600';

            return {
                id: booking.id,
                label: booking.items[0]?.name || 'Service',
                status: booking.status === 'Shipped' ? 'In Progress' : booking.status,
                person: booking.technician || 'Unassigned',
                statusColor
            };
        });

    const recentOrders = orders
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4)
        .map(order => {
            let statusColor = 'bg-slate-200 text-slate-600';
            if (order.status === 'Pending') statusColor = 'bg-orange-100 text-orange-600';
            if (order.status === 'Processing') statusColor = 'bg-amber-100 text-amber-600';
            if (order.status === 'Shipped') statusColor = 'bg-indigo-100 text-indigo-600';
            if (order.status === 'Delivered') statusColor = 'bg-emerald-100 text-emerald-600';

            return {
                id: order.id,
                product: order.items.map(i => i.name).join(', ').substring(0, 25) + '...',
                client: order.customerName,
                amount: `₹${order.total}`,
                status: order.status,
                statusColor
            };
        });

    // Chart Data Generation (Aggregating by Month)
    const monthlyData = [
        { name: 'Jan', sales: 0, bookings: 0 },
        { name: 'Feb', sales: 0, bookings: 0 },
        { name: 'Mar', sales: 0, bookings: 0 },
        { name: 'Apr', sales: 0, bookings: 0 },
        { name: 'May', sales: 0, bookings: 0 },
        { name: 'Jun', sales: 0, bookings: 0 },
        { name: 'Jul', sales: 0, bookings: 0 },
        { name: 'Aug', sales: 0, bookings: 0 },
        { name: 'Sep', sales: 0, bookings: 0 },
        { name: 'Oct', sales: 0, bookings: 0 },
        { name: 'Nov', sales: 0, bookings: 0 },
        { name: 'Dec', sales: 0, bookings: 0 },
    ];

    completedOrders.forEach(order => {
        const month = new Date(order.date).getMonth();
        monthlyData[month].sales += order.total;
    });

    orders.filter(o => o.type === 'Service' || o.type === 'Mixed').forEach(order => {
        const month = new Date(order.date).getMonth();
        monthlyData[month].bookings += 1;
    });

    // We can slice the data to just show up to current month or however needed, 
    // but for simplicity passing the whole year or first N months.
    const chartData = monthlyData.slice(0, Math.max(7, currentMonth + 1));

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Sales"
                    value={`₹${totalSales.toLocaleString()}`}
                    icon={DollarSign}
                    iconBg="bg-emerald-50 text-emerald-600"
                    iconColor="text-emerald-600"
                />
                <StatCard
                    title="Bookings"
                    value={totalBookings.toString()}
                    icon={Calendar}
                    iconBg="bg-indigo-50 text-indigo-600"
                    iconColor="text-indigo-600"
                />
                <StatCard
                    title="Customers"
                    value={uniqueCustomers.toString()}
                    icon={Users}
                    iconBg="bg-sky-50 text-sky-600"
                    iconColor="text-sky-600"
                />
                <StatCard
                    title="Employees"
                    value={totalEmployees.toString()}
                    icon={HardHat}
                    iconBg="bg-slate-50 text-slate-600"
                    iconColor="text-slate-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <SalesOverview data={chartData} />
                </div>

                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-800">Earnings This Month</h3>
                        <span className="p-2 bg-slate-50 rounded-lg"><TrendingUp className="w-4 h-4 text-emerald-500" /></span>
                    </div>
                    <div className="mb-4">
                        <h2 className="text-4xl font-bold text-slate-800">₹{earningsThisMonth.toLocaleString()}</h2>
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-1 mt-2">
                            Current Month
                        </p>
                    </div>
                    <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
                        <p className="text-sm font-medium text-slate-600">Service Bookings</p>
                        <div className="space-y-4">
                            {serviceBookings.map((booking) => (
                                <div key={booking.id} className="flex flex-col gap-1 p-3 bg-slate-50 rounded-xl relative overflow-hidden group hover:bg-white border border-transparent hover:border-slate-100 transition-all">
                                    <span className="text-sm font-bold text-slate-800">{booking.label}</span>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500">{booking.person}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${booking.statusColor}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {serviceBookings.length === 0 && <p className="text-sm text-slate-500">No service bookings yet.</p>}
                        </div>
                        <button className="w-full py-2.5 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all mt-2">
                            View All
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-800">Recent Orders</h3>
                        <button className="text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all">View All</button>
                    </div>
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center font-bold text-xs text-slate-500">
                                        {order.id.split('-')[1] || order.id}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">{order.product}</h4>
                                        <p className="text-xs text-slate-500">{order.client}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <h4 className="text-sm font-bold text-slate-800">{order.amount}</h4>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${order.statusColor}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {recentOrders.length === 0 && <p className="text-sm text-slate-500">No recent orders found.</p>}
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-800">Customer Reviews</h3>
                        <button className="text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all">View All</button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { author: 'John D.', text: 'Great service, very fast installation!', rating: 5 },
                            { author: 'Sarah L.', text: 'Camera quality is excellent.', rating: 5 },
                            { author: 'Mike W.', text: 'Technician was very professional.', rating: 5 },
                        ].map((review, i) => (
                            <div key={i} className="p-4 bg-slate-50 rounded-2xl">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-bold text-slate-800">{review.author}</span>
                                    <div className="flex items-center gap-0.5">
                                        {Array.from({ length: review.rating }).map((_, starIndex) => (
                                            <Star key={starIndex} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>

                                </div>
                                <p className="text-xs text-slate-600 line-clamp-1 italic">"{review.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
