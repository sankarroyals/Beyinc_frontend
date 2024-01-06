import axiosInstance from "../Components/axiosInstance";



export const ApiServices = {
    verifyAccessToken: (obj) => {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/auth/verifyApiAccessToken`, obj)
                .then((res) => {
                    if (res) {
                        resolve(res)
                    }
                })
                .catch((err) => reject(err));

        })
    },
    updateuserProfileImage: (obj) => {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/userDetails/updateProfileImage`, obj)
                .then((res) => {
                    if (res) {
                        resolve(res)
                    }
                })
                .catch((err) => reject(err));

        })
    },
    deleteuserProfileImage: (obj) => {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/userDetails/deleteProfileImage`, obj)
                .then((res) => {
                    if (res) {
                        resolve(res)
                    }
                })
                .catch((err) => reject(err));

        })
    },
    refreshToken: (obj) => {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/auth/refresh-token`, obj)
                .then((res) => {
                    if (res) {
                        
                        resolve(res)
                    }
                })
                .catch((err) => reject(err));

        })
    },
    sendOtp : (obj) => {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/auth/sendEmailOtp`, obj)
            .then((res) => {
                if(res) {
                    
                    resolve(res)
                }
            })
            .catch((err) => reject(err));
    
        }) 
    }, 
    verifyOtp : (obj) => {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/auth/verifyOtp`, obj)
            .then((res) => {
                if(res) {
                    resolve(res)
                }
            })
            .catch((err) => reject(err));
    
        }) 
    },
    register : (obj) => {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/auth/register`, obj)
            .then((res) => {
                if(res) {
                    resolve(res)
                }
            })
            .catch((err) => reject(err));
    
        }) 
    },
    sendForApproval: (obj) => {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/userDetails/editprofile`, obj)
                .then((res) => {
                    if (res) {
                        resolve(res)
                    }
                })
                .catch((err) => reject(err));

        })
    },
    getProfile: (obj) => {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/userDetails/getUser`, obj)
            .then((res) => {
                if(res) {
                    resolve(res)
                }
            })
            .catch((err) => reject(err));
    
        }) 
    },
    login : (obj) => {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/auth/login`, obj)
            .then((res) => {
                if(res) {
                    resolve(res)
                }
            })
            .catch((err) => reject(err));
    
        }) 
    },
    mobileLogin : (obj) => {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/auth/mobile/login`, obj)
            .then((res) => {
                if(res) {
                    resolve(res)
                }
            })
            .catch((err) => reject(err));
    
        }) 
    },
    resetPassword : (obj) => {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/auth/forgotPassword`, obj)
            .then((res) => {
                if(res) {
                    resolve(res)
                }
            })
            .catch((err) => reject(err));
    
        }) 
    },
}