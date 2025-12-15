import React from 'react';

const Home = () => {
    const handleTestContest = async () => {
        const contest = {
            title: "Test Contest",
            image: "https://via.placeholder.com/400",
            description: "This is a test contest",
            taskInstruction: "Submit a link",
            contestType: "Image Design",
            price: 5,
            prizeMoney: 100,
            deadline: "2025-01-20",
            creatorEmail: "test@gmail.com",
            creatorName: "Test Creator",
        };

        const res = await fetch("http://localhost:3000/contests", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(contest),
        });

        const data = await res.json();
        console.log(data);
    };



    return (
        <div>
            <button onClick={handleTestContest} className="btn btn-primary">
                Create Test Contest
            </button>
        </div>
    );
};

export default Home;