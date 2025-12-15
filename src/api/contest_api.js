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

export const getCreatorContests = async (email) => {
    const res = await fetch(`http://localhost:3000/contests/creator/${email}`);
    return res.json();
};

export const getAllContestsAdmin = async () => {
    const res = await fetch("http://localhost:3000/admin/contests");
    return res.json();
};

export const updateContestStatus = async (id, status) => {
    const res = await fetch(`http://localhost:3000/admin/contests/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
    });
    return res.json();
};

export const deleteContest = async (id) => {
    const res = await fetch(`http://localhost:3000/admin/contests/${id}`, {
        method: "DELETE",
    });
    return res.json();
};


