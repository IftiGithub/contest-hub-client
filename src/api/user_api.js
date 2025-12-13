export const saveUser = async (user) => {
    const userInfo = {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
    };

    const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(userInfo),
    });

    return res.json();
};

export const getUserByEmail = async (email) => {
    const res = await fetch(`http://localhost:3000/users/${email}`);

    if (!res.ok) {
        // if 404, return null instead of throwing
        return null;
    }

    return res.json();
};

