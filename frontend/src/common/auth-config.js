export const getAuthConfig = () => {
    const access_token = sessionStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    };
};
