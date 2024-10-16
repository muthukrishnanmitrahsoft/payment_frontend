import { useEffect, useState, useRef } from 'react'; // Add useRef
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; // For toast notifications
import { Chart } from "react-google-charts";

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
        searchParams.delete('status');
        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.replaceState(null, '', newUrl);
    }, []);

    // Prepare the data for the Pie chart
    const chartData = [
        ['Task', 'Count'], // Define the column names
        ['Successful Payments', analytics ? analytics.total_success : 0],
        ['Failed Payments', analytics ? analytics.total_failure : 0],
        ['Pending Payments', analytics ? analytics.total_pending : 0],
    ];

    // Chart options
    const chartOptions = {
        title: '',
        pieHole: 0.4, // This creates a donut chart; set to 0 for a regular pie chart
        tooltip: { text: 'label' }, // Show label instead of percentage
    };

    const navigateToAddons = () => {
        navigate('/');
    };

    // Calculate the total payments
    const totalPayments = analytics
        ? analytics.total_success + analytics.total_failure + analytics.total_pending
        : 0;

    return (
        <div style={{ textAlign: 'center', padding: '20px', position: 'relative' }}>
            <Toaster /> {/* This will render the toast notifications */}

            {/* Dashboard Header */}
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Payments Statistics</h1>

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
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '25%', position: 'relative' }}>
                    <div style={{ width: '40%' ,    border: '2px solid black'}}>
                        <Chart
                            chartType="PieChart" // Specify the chart type
                            data={chartData} 
                            options={chartOptions} 
                            width={'100%'} // Optional, for full width
                            height={'400px'} // Optional, set height as needed
                        />
                        {/* Total Count Overlay */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '45%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#000', // Color of the text
                        }}>
                            {totalPayments}
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading analytics...</p>
            )}
        </div>
    );
};

export default Dashboard;
