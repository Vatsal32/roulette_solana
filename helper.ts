export const getReturnAmount: (amt: number, ratio: number) => number = (amt: number, ratio: number) => {
    return amt * ratio;
};

export const totalAmtToBePaid: (amt: number) => number = (amt: number) => {
    return amt;
};

export const randomNumber: (min: number, max: number) => number = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
};
