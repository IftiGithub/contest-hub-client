// Fetch contests user participated in
export const getParticipatedContests = async (email) => {
    const res = await fetch(`http://localhost:3000/participated-contests/${email}`);
    return res.json();
};

// Fetch contests user won
export const getWinningContests = async (email) => {
    const res = await fetch(`http://localhost:3000/winning-contests/${email}`);
    return res.json();
};
