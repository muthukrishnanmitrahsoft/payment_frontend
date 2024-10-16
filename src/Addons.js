import { useEffect, useContext, useRef, useState } from 'react'; // Added useState
import { useNavigate } from 'react-router-dom';
import { Card, Button, InputNumber, Carousel, Select } from 'antd'; // Import Select
import { Steps, List } from 'antd';
import chicken from './assist/Lunch_700+x+400+px.jpg';
import './Addons.css';
import meals_img from "./assist/Meal_Image_k.svg";
import { BookingContext } from './BookingContext';
import toast, { Toaster } from 'react-hot-toast';

const { Option } = Select; // Destructure Option from Select

function Addons() {
    const { quantities, setQuantities, totalAddCost, setTotalAddonCost } = useContext(BookingContext);
    const hasShownToast = useRef(false);
    const navigate = useNavigate();

    const [currency, setCurrency] = useState("EUR"); // State for currency
    const currencySymbols = {
        USD: "$",
        EUR: "€",
        GBP: "£",
        // Add more currencies as needed
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const status = searchParams.get('status');

        if (status === 'success' && !hasShownToast.current) {
            toast.success('Payment successful!');
            hasShownToast.current = true;
        } else if (status === 'failed' && !hasShownToast.current) {
            toast.error('Payment failed. Please try again.');
            hasShownToast.current = true;
        }
        searchParams.delete('status');
        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.replaceState(null, '', newUrl);
    }, []);

    const handleItemClick = async () => {
        const BASE_URL = process.env.REACT_APP_CREATEPAYMENT;

        const selectedItems = foodItems
            .filter(item => quantities[item.id] > 0)
            .map(item => ({
                name: item.name,
                price: item.price,
                quantity: quantities[item.id],
            }));

        const paymentData = {
            amount: totalAddCost,
            currency: currency, // Send selected currency
            description: "Payment for selected items",
            expiration: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            items: selectedItems,
        };

        try {
            const response = await fetch(BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();

            navigator.clipboard.writeText(data.payment_url)
                .then(() => {
                    toast.success('Payment link copied to clipboard!');
                })
                .catch((err) => {
                    console.error('Error copying to clipboard:', err);
                    toast.error('Failed to copy the payment link. Please try again.');
                });

        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to initiate payment. Please try again.');
        }
    };

    const handleIncrement = (itemId, itemPrice) => {
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [itemId]: (prevQuantities[itemId] || 0) + 1,
        }));
        setTotalAddonCost(totalAddCost + itemPrice);
    };

    const handleDecrement = (itemId, itemPrice) => {
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [itemId]: Math.max(0, (prevQuantities[itemId] || 0) - 1),
        }));
        setTotalAddonCost(totalAddCost - itemPrice);
    };

    const navigateToAddons = () => {
        navigate('/dashboard');
    };

    const handleCurrencyChange = (value) => {
        setCurrency(value); // Update selected currency
    };

    const cardContent = (
        <div style={{ position: 'relative', color: '#000', padding: '20px', height: '100%', marginTop: '2%' }}>
            <div className="box-left">
                <div className="left-title" id="backBtn" style={{ display: 'inline-block', width: '17rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>
                            <div className="title">Plan Your Meal</div>
                        </span>
                    </div>
                </div>
                <p style={{ marginTop: '4%' }}>
                    Wonderla offers a delightful array of mouth-watering food dishes. A whopping 40% of our bookings opt for the All-Day meal Plan, making it the ideal choice for a day out at Wonderla.
                </p>
            </div>
            <div style={{ textAlign: 'center' }}>
                <img src={meals_img} style={{ height: 400, width: '400px' }} alt="Meal" />
            </div>
        </div>
    );

    const foodItems = [
        {
            id: 1,
            name: "Lunch | Snacks",
            price: 399,
            images: [chicken, chicken, chicken]
        },
        {
            id: 2,
            name: "Breakfast | Lunch | Snacks",
            price: 469,
            images: [chicken, chicken, chicken]
        },
        {
            id: 3,
            name: "Lunch | Snacks | Dinner",
            price: 519,
            images: [chicken, chicken, chicken]
        },
        // Add more food items as needed
    ];

    return (
        <div>
            <Toaster position="top-right" reverseOrder={false} />
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
            <Select
                defaultValue={currency}
                style={{ width: 120, position: 'absolute', top: '20px', left: '20px' }}
                onChange={handleCurrencyChange}
            >
                <Option value="EUR">EUR</Option>
                <Option value="USD">USD</Option>
                <Option value="GBP">GBP</Option>
                {/* Add more options as needed */}
            </Select>
            <div style={{ display: "flex", justifyContent: "center", gap: "3%", flexWrap: 'wrap', marginTop: "2%" }}>
                <Card
                    hoverable
                    style={{
                        width: 562,
                        borderRadius: '12px',
                        height: 562,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {cardContent}
                </Card>

                <Card
                    hoverable
                    style={{
                        width: 562,
                        borderRadius: '12px',
                        height: 562,
                        backgroundColor: 'white',
                    }}
                >
                    <div style={{ height: "440px", overflowY: "scroll" }}>
                        <List
                            itemLayout="vertical"
                            dataSource={foodItems}
                            renderItem={item => (
                                <Card hoverable className='meal-inner'>
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={
                                                <Carousel autoplay dots={false}>
                                                    {item.images.map((img, index) => (
                                                        <div key={index}>
                                                            <img src={img} style={{ width: "100%", height: "auto" }} alt="Food item" />
                                                        </div>
                                                    ))}
                                                </Carousel>
                                            }
                                            title={<h2 className='meal-info'>{item.name} @ {currencySymbols[currency]}{item.price}</h2>} 
                                            description={
                                                <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #2542A8', borderRadius: '30px', backgroundColor: '#2542A8', padding: '5px 10px', width: "39%" }}>
                                                    <Button
                                                        type="primary"
                                                        shape="circle"
                                                        onClick={() => handleDecrement(item.id, item.price)}
                                                        style={{ backgroundColor: 'white', borderColor: 'white', color: 'blue' }}
                                                        disabled={quantities[item.id] === 0}
                                                    >
                                                        -
                                                    </Button>
                                                    <InputNumber
                                                        min={0}
                                                        value={quantities[item?.id] || 0}
                                                        bordered={false}
                                                        style={{ margin: '0 10px', width: '40px', textAlign: 'center', color: 'white', backgroundColor: '#2542A8', borderColor: '#2542A8', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                                        readOnly
                                                    />
                                                    <Button
                                                        type="primary"
                                                        shape="circle"
                                                        onClick={() => handleIncrement(item.id, item.price)}
                                                        style={{ backgroundColor: 'white', borderColor: 'white', color: 'blue' }}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                </Card>
                            )}
                        />
                    </div>

                    <div style={{ position: "sticky", bottom: "1px", backgroundColor: "white", height: "100px", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                        <div className='bottom-left-part' style={{ width: "40%", display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: "2%" }}>
                            <h2 style={{ fontSize: "18.711px", fontWeight: "700", margin: "0" }}>{currencySymbols[currency]} {totalAddCost}</h2> {/* Use currency symbol */}
                            <p style={{ margin: "0" }}>Excl. all taxes</p>
                        </div>
                        <div style={{ width: "60%", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                            <Button
                                type="primary"
                                shape="circle"
                                style={{ backgroundColor: 'rgb(37, 66, 168)', borderColor: 'rgb(37, 66, 168)', color: 'white', borderRadius: "54px", height: "56px", width: "70%" }}
                                onClick={handleItemClick}
                            >
                                Copy Link
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default Addons;
