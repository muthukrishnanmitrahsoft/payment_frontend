import React, { useContext, useState } from 'react';
import { Card, Button, InputNumber, Carousel } from 'antd';
import { Steps, List, Avatar } from 'antd';
import chicken from './assist/Lunch_700+x+400+px.jpg';
import './Addons.css';
import meals_img from "./assist/Meal_Image_k.svg"
import { BookingContext } from './BookingContext';
import toast, { Toaster } from 'react-hot-toast'; // Import toast





function Addons() {

    const { quantities, setQuantities, totalAddCost, setTotalAddonCost } = useContext(BookingContext);


    const handleItemClick = async () => {
        const BASE_URL = process.env.REACT_APP_CREATEPAYMENT;
        console.log("asdd",BASE_URL)
        const paymentData = {
            amount: totalAddCost,
            currency: "USD",
            description: "Payment for order #12345",
            expiration: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
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
            window.location.href = data.payment_url;
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to initiate payment. Please try again.');
        }
    };
    

    const cardContent = (
        <div
            style={{
                position: 'relative',
                color: '#000',
                padding: '20px',
                height: '100%',
                marginTop:"2%"
            }}
        >
            <div className="box-left">
                <div className="left-title" id="backBtn" style={{ display: 'inline-block', width: "17rem" }}>
                    <div style={{ display: 'flex', justifyContent: "space-between" }}>
                        <span>
                            <div className="title">Plan Your Meal</div>
                        </span>
                    </div>
                </div>
                <p style={{ marginTop: "4%" }}>Wonderla offers a delightful array of mouth - watering food   <br />   dishes. A whopping 40% of our bookings opt for the All-Day   <br />   meal Plan, making it the ideal choice for a day out at Wonderla</p>
            </div>
            <div style={{ textAlign: "center" }}>

                <img src={meals_img} style={{ height: 400, width: "400" }} />
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
        {
            id: 3,
            name: "Lunch | Snacks | Dinner",
            price: 519,
            images: [chicken, chicken, chicken]
        },

        // Add more food items as needed
    ];




    // Function to handle increment
    const handleIncrement = (itemId, itemPrice) => {
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [itemId]: (prevQuantities[itemId] || 0) + 1,

        }));
        setTotalAddonCost(totalAddCost + itemPrice)

    };

    // Function to handle decrement
    const handleDecrement = (itemId, itemPrice) => {
        console.log("quantities", quantities)
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [itemId]: Math.max(0, (prevQuantities[itemId] || 0) - 1), // Prevent negative quantities
        }));
        setTotalAddonCost(totalAddCost - itemPrice)

    };


    return (
        <div>

        <div style={{ display: "flex", justifyContent: "center", gap: "3%", flexWrap: 'wrap',marginTop:"2%" }}>
            
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
                {/* Add content inside this card or remove if not needed */}
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
                <div style={{
                    height: "440px", overflowY: "scroll"
                }}>
                    <List
                        itemLayout="vertical"
                        dataSource={foodItems}
                        renderItem={item => (
                            <Card
                                hoverable
                                className='meal-inner'
                            >
                                <List.Item>
                                    <List.Item.Meta
                                        // avatar={<Avatar style={{ width: "90%", borderRadius: "0" }} src={item.image} size={120} />}

                                        avatar={
                                            <Carousel autoplay dots={false}>
                                                {item.images.map((img, index) => (
                                                    <div key={index}>
                                                        <img src={img} style={{ width: "100%", height: "auto" }} alt="Food item" />
                                                    </div>
                                                ))}
                                            </Carousel>
                                        }

                                        title={<h2 className='meal-info'>{item.name} @ $.{item.price}</h2>}
                                        description={
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                border: '2px solid #2542A8',
                                                borderRadius: '30px',
                                                backgroundColor: '#2542A8',
                                                padding: '5px 10px',
                                                width: "50%"
                                            }}>
                                                <Button
                                                    type="primary"
                                                    shape="circle"
                                                    onClick={() => handleDecrement(item.id, item.price)} // Handle decrement
                                                    style={{
                                                        backgroundColor: 'white',
                                                        borderColor: 'white',
                                                        color: 'blue',

                                                    }}
                                                    disabled={quantities[item.id] === 0} // Disable if quantity is 0
                                                >
                                                    -
                                                </Button>
                                                <InputNumber
                                                    min={0}
                                                    value={quantities[item?.id] || 0} // Bind value to state
                                                    bordered={false}
                                                    style={{
                                                        margin: '0 10px',
                                                        width: '40px',
                                                        textAlign: 'center',
                                                        color: 'white',
                                                        backgroundColor: '#2542A8',
                                                        borderColor: '#2542A8',
                                                        fontWeight: 'bold',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}
                                                    readOnly
                                                />

                                                <Button
                                                    type="primary"
                                                    shape="circle"
                                                    onClick={() => handleIncrement(item.id, item.price)} // Handle increment
                                                    style={{
                                                        backgroundColor: 'white',
                                                        borderColor: 'white',
                                                        color: 'blue',

                                                    }}
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


                <div style={{ position: "sticky", bottom: "1px", backgroundColor: "white", height: "100px", display: "flex", alignItems: "center", justifyContent: "space-arround" }}>
                    <div className='bottom-left-part' style={{ width: "40%", display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: "2%" }}>
                        <h2 style={{ fontSize: "18.711px", fontWeight: "700" }}>$ {totalAddCost}</h2>
                        <p>Excl. all taxes</p>
                    </div>
                    <div style={{ width: "60%", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                        <Button
                            type="primary"
                            shape="circle"
                            style={{
                                backgroundColor: 'rgb(37, 66, 168)',
                                borderColor: 'rgb(37, 66, 168)',
                                color: 'white',
                                borderRadius: "54px",
                                height: "56px",
                                width: "70%"

                            }}
                            onClick={() => handleItemClick(4)}
                        >
                            PROCEED
                        </Button>
                    </div>
                </div>
            </Card>



        </div>
        </div>
    );
}

export default Addons;
