import axiosInstance from "../Components/axiosInstance";



export const AdminServices = {

    updateVerification: (obj) => {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/userDetails/updateVerification`, obj)
                .then((res) => {
                    if (res) {
                        resolve(res)
                    }
                })
                .catch((err) => reject(err));

        })
    },


    getApprovalRequestProfile: (obj) => {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/userDetails/getApprovalRequestProfile`, obj)
                .then((res) => {
                    if (res) {
                        resolve(res)
                    }
                })
                .catch((err) => reject(err));

        })
    },


    getRequestedUsersBasedOnFilters: (obj) => {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/userDetails/getAllRequests`, obj)
                .then((res) => {
                    if (res) {
                        resolve(res)
                    }
                })
                .catch((err) => reject(err));

        })
    }
}