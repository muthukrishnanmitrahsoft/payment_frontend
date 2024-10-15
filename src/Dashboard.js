import { useEffect, useState, useRef } from 'react'; // Add useRef
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; // For toast notifications
import { Pie } from 'react-chartjs-2'; // Import Pie chart from react-chartjs-2
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const navigate = useNavigate();
    const hasShownToast = useRef(false); // Create a ref to track toast

    // Fetch analytics data after the component mounts
    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_ANALYTICS, {
                    method: 'GET',
                });
                const data = await response.json();
                setAnalytics(data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            }
        };
        fetchAnalytics();
    }, []);

    // Show toast notifications based on query params
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const status = searchParams.get('status');

        if (status === 'success' && !hasShownToast.current) { // Check if toast has been shown
            toast.success('Payment successful!');
            hasShownToast.current = true; // Mark toast as shown
        } else if (status === 'failed' && !hasShownToast.current) {
            toast.error('Payment failed. Please try again.');
            hasShownToast.current = true; // Mark toast as shown
        }
    }, []);

    // Chart data and options
    const chartData = {
        labels: ['Total Payments', 'Successful Payments', 'Failed Payments', 'Pending Payments'],
        datasets: [
            {
                label: 'Payments Statistics',
                data: analytics
                    ? [
                        analytics.total_payments,
                        analytics.total_success,
                        analytics.total_failure,
                        analytics.total_pending
                    ]
                    : [0, 0, 0, 0], // Default data when analytics is not available
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)', 
                    'rgba(54, 162, 235, 0.6)', 
                    'rgba(255, 99, 132, 0.6)', 
                    'rgba(255, 206, 86, 0.6)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)', 
                    'rgba(54, 162, 235, 1)', 
                    'rgba(255, 99, 132, 1)', 
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Payments Statistics',
            },
        },
    };

    const navigateToAddons = () => {
        navigate('/');
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px', position: 'relative' }}>
            <Toaster /> {/* This will render the toast notifications */}

            {/* Dashboard Header */}
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Dashboard</h1>

            {/* "Go to Addons" button positioned in the top-right corner */}
            <button 
                onClick={navigateToAddons} 
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Go to Addons
            </button>

            {/* Render Pie chart */}
            {analytics ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '25%' }}>
                    <div style={{ width: '40%',  }}>
                        <Pie data={chartData} options={chartOptions} />
                    </div>
                </div>
            ) : (
                <p>Loading analytics...</p>
            )}
        </div>
    );
};

export default Dashboard;
